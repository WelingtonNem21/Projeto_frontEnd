import { useEffect, useState, useRef, FormEvent } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { api } from './services/api'

interface customersProps {
  id: string,
  nome: string,
  email: string,
  status: boolean,
  created_at: string
}

function App() {

  const [customers, setCustomers] = useState<customersProps[]>([])
  const nomeRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  async function getResposes() {
    const resposes = await api.get("customers");
    setCustomers(resposes.data)
  }


  useEffect(() => {
    getResposes()
  }, [])

  async function hendleSubmite(event: FormEvent) {

    event.preventDefault()

    if (!nomeRef.current?.value || !emailRef.current?.value) return

    const respose = await api.post("customer", {
      nome: nomeRef.current?.value,
      email: emailRef.current?.value
    })

    setCustomers(allCustomers => [...allCustomers, respose.data])

    nomeRef.current.value = ""
    emailRef.current.value = ""

  }

  async function hendleDelete(id: string) {

    try {
      const deletes = await api.delete("customers", {
        params: {
          id: id
        }
      })
      console.log(deletes)
      const allCustomers = customers.filter((customer) => customer.id !== id)
      setCustomers(allCustomers)
    } catch (error) {
      console.log(error)

    }
  }


  return (
    <div className="w-full min-h-screen bg-gray-900 flex justify-center px-4">
      <main className="my-10 w-full md:max-w-2xl">
        <h1 className="text-4xl font-medium text-center text-green-500">Clientes</h1>

        <form className="flex flex-col my-6" onSubmit={hendleSubmite}>
          <label className="text-white font-medium">Nome:</label>
          <input
            type="text"
            className="w-full p-2 rounded mb-5 "
            placeholder="Digite seu nome completo"
            ref={nomeRef}
          />

          <label className="text-white font-medium">Email:</label>
          <input
            type="email"
            className="w-full p-2 rounded mb-5 "
            placeholder="Digite seu Email completo"
            ref={emailRef}
          />

          <button type="submit" className="bg-green-500 p-1 font-medium text-black rounded">Enviar</button>
        </form>

        <section className="flex flex-col gap-4">

          {customers.map((item) => (
            <article key={item.id} className="bg-white rounded p-2  relative hover:scale-105 duration-200">
              <p><span className="font-medium">Nome:</span> {item.nome}</p>
              <p><span className="font-medium">Email:</span> {item.email}</p>
              <p><span className="font-medium">Status:</span> {item.status ? "Ativo" : "Inativo"}</p>

              <button onClick={() => hendleDelete(item.id)} className="bg-red-600 p-1 rounded-lg absolute right-0 -top-2">
                <RiDeleteBinLine size={18} color="#FFFF" />
              </button>
            </article>
          ))}


        </section>
      </main>
    </div>
  )
}

export default App
