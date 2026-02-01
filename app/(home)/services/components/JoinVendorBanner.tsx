import Image from "next/image";
import Link from "next/link";
const JoinVendorBanner = ()=>{



    return(

        <>
            <div className="h-120 pb-20 flex justify-center">
                <Image
                src={"/BannerJoin.png"}
                alt="Banner"
                height={128}
                width={1024}
                />

            <div className="absolute mt-[220px] mr-[800px] h-[30px] w-[120px] bg-[#1A1F71]">
                <Link href="/become-a-vendor">
                    <p className="text-white text-[10px] ml-[16px]">Become A Vendor</p>
                </Link>
            </div>
            </div>


        </>

    )


}

export default JoinVendorBanner;