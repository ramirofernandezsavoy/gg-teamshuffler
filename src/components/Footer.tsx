import Link from "next/link"
import Image from "next/image"
import coin from "../../public/coin.svg"
import github from "../../public/brand-github.svg"
import mail from "../../public/mail.svg"


export default function Footer() {
  return (
    <section className="bg-zinc-950 py-4">
        <footer className="wrapper flex justify-between items-center ">
            <div>
                Donaciones
            </div>
            <div>
                <p>
                    by <Link href="https://www.ramirofernandezsavoy.com" target="_blank" className="font-medium hover:text-pink-200">Ramiro Fernandez Savoy</Link>
                </p>
                <div className="flex justify-end gap-2">                    
                <Link className="hover:scale-125 duration-150 p-1" href="https://link.mercadopago.com.ar/ramirosavoy" target="_blank"><Image src={coin} alt="Coin Icon" width={32} /></Link>
                <Link className="hover:scale-125 duration-150 p-1" href="https://github.com/ramirofernandezsavoy/gg-teamshuffler" target="_blank"><Image src={github} alt="Github Icon" width={32} /></Link>
                <Link className="hover:scale-125 duration-150 p-1" href="mailto:savoyrfs@gmail.com" target="_blank"><Image src={mail} alt="Mail Icon" width={32} /></Link>
                </div>
            </div>
        </footer>
    </section>
  )
}
