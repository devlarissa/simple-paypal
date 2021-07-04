import React, {useState, useEffect, useRef} from "react";


export default function App() {
  const [paid, setPaid] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();

  const product = {
    price: 10.00,
    description: "Test Paypal",
  }

  useEffect(() => {
    const script = document.createElement("script");
    const id = "o client id gerado pelo paypal vai aqui"
    script.src = "https://www.paypal.com/sdk/js?currency=BRL&client-id=${id}";

    script.addEventListener("load", () => setLoaded(true));

    document.body.appendChild(script);

    if (loaded){
      function loadButtonAndLogicAboutPayment(){
        setTimeout(() => {
          window.paypal
            .Buttons({
              creatOrder: (data, actions) =>{
                return actions.order.create({
                  purchase_units: [{
                    description: product.description,
                    amount: {
                      curency_code: "BRL",
                      value: product.price
                    }
                  }]
                });
              },
              onApprove: async (_, actions) =>{
                const order = await actions.order.capture();
                setPaid(true);
                console.log(order);
              }
            })
            .render(paypalRef);
        })
      }
      loadButtonAndLogicAboutPayment();
    }

  })

  return (
    <div className={"App"}>
      {paid ? (
        <div>
          <h2> Compra efetuada com sucesso! </h2>
        </div>
      ): (
        <>
        <h3>{product.description} por R${product.price}</h3>
          <div ref={v => (paypalRef = v)}/>
        </>
      )}
    </div>
  );
}
