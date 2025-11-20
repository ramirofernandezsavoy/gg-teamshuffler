import Link from "next/link"
import Image from "next/image"
import coin from "../../public/coin.svg"
import github from "../../public/brand-github.svg"
import mail from "../../public/mail.svg"


export default function Footer() {
  return (
    <section className="bg-slate-950 border-t border-white/10 py-6">
        <footer className="wrapper flex justify-between items-center ">
            <div>
                {/* Donaciones */}
            </div>
            <div>
                <p className="text-sm text-white/70">
                    by <Link href="https://www.ramirofernandezsavoy.com" target="_blank" className="font-medium hover:text-blue-400 transition-colors">Ramiro Fernandez Savoy</Link>
                </p>
                <div className="flex justify-end gap-2 mt-2">                    
                <Link className="hover:scale-110 hover:opacity-80 transition-all p-1" href="https://link.mercadopago.com.ar/ramirosavoy" target="_blank"><Image src={coin} alt="Coin Icon" width={32} /></Link>
                <Link className="hover:scale-110 hover:opacity-80 transition-all p-1" href="https://github.com/ramirofernandezsavoy/gg-teamshuffler" target="_blank"><Image src={github} alt="Github Icon" width={32} /></Link>
                <Link className="hover:scale-110 hover:opacity-80 transition-all p-1" href="mailto:savoyrfs@gmail.com" target="_blank"><Image src={mail} alt="Mail Icon" width={32} /></Link>
                </div>
            </div>
        </footer>
    </section>
  )
}
