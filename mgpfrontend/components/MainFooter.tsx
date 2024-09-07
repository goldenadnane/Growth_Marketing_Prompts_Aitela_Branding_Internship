import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function MainFooter() {
    return (
        <>
            <footer className="mt-2 flex gap-10 bg-[#283646] px-5 py-5 sm:gap-14 lg:gap-80">
                <div className="flex w-6/12 flex-col pt-1 lg:w-8/12">
                    <Link href={'/'}>
                        <Image src="/assets/images/MGP_Logo.png" width={200} height={200} alt="" className=" rounded-lg" />
                    </Link>
                    <ul className="items-left mt-8 flex flex-col gap-2 whitespace-nowrap text-white lg:flex-row lg:gap-5">
                        <li>
                            <Link href="/about">About</Link>
                        </li>
                        <li>
                            <Link href="/careers">Careers</Link>
                        </li>
                        <li>
                            <Link href="/press">Press</Link>
                        </li>
                        <li>
                            <Link href="/customer">Customer Care</Link>
                        </li>
                        <li>
                            <Link href="/services">Services</Link>
                        </li>
                    </ul>
                </div>
                <div className="contact lg:6/12  w-full">
                    <p className="mb-3 text-white">Contact us</p>
                    <form action="" className="flex flex-col gap-3">
                        <input type="email" name="email" id="email" placeholder="Your email address…" className="mb-3 h-10 w-full rounded-md px-2 py-1 md:w-60 lg:w-80 " />
                        <textarea
                            title="message"
                            name="message"
                            id="message"
                            placeholder="Tape your message…"
                            className=" mb-3 h-24 w-full resize-none rounded-md px-3 py-2 md:w-60 lg:w-80 "
                        ></textarea>
                        <button className="w-5/12 rounded-md bg-[#26A8F4] px-3 py-2 text-white md:w-1/5">Send</button>
                    </form>
                </div>
            </footer>
        </>
    );
}

export default MainFooter;
