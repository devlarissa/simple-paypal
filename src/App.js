import React, {useState, useEffect, useRef} from "react";


export default function Paypal() {

  const [paid, setPaid] = useState(false);
  const [loaded, setLoaded] = useState(false);
  let paypalRef = useRef();

  const product = {
    price: 1.99,
    description: "Assinatura teste",
  }

  useEffect(() => {
    const script = document.createElement("script");
    const id = "AdXb--4YISs-tHNsqUa540bL2-lrEnXRRhyVD6Axb9JcWWcdUgJ7m9rBOYzNQFVfXNze2m75AXik8IJD";
    script.src = `https://www.paypal.com/sdk/js?currency=BRL&client-id=${id}`

    script.addEventListener("load", () => setLoaded(true));

    document.body.appendChild(script);

    if (loaded) {
      function loadButtonsAndPayment() {
        setTimeout(() => {
          window.paypal
            .Buttons({
              createOrder: (data, actions) => {
                return actions.order.create({

                  purchase_units: [
                    {
                      description: product.description,
                      amount: {
                        currency_code: "BRL",
                        value: product.price
                      }
                    }
                  ]
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

      loadButtonsAndPayment();
    }
  })
  return (
    <>
      <div>
        {paid ? (
          <div>
            <h1> Assinatura comprada com sucesso!</h1>
          </div>
        ) : (
          <>
            <div>
              <h1>
                {product.description} por R${product.price}
              </h1>
            </div>
            <div id={"centralize"}>
              <div ref={v => (paypalRef = v)}/>
            </div>
          </>
        )}

      </div>
    </>
  );
}
