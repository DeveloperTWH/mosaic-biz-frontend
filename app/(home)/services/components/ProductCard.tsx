import React from "react";

type ProductCardProps = {
  image: string;
  title: string;
  description: string;
  rating: number; // 0–5
  totalRatings: number;
  reviews: number;
  badge?: string;
};


const HorizontalLine = () => {
  return <p style={{ borderTop: '1px solid', color : "#D9D9D9",  margin: '10px 0' }}></p> ;
};

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  rating,
  totalRatings,
  reviews,
  badge,
}) => {
  return (
    <div className="product-card h-[400px]">
      <img src={image} alt={title} className="product-image h-[180px] w-full" />

      <div className="product-content">
        {/* Ratings */}
        <div className="mt-1 text-xs text-[#909090]">
            ⭐ ⭐ ⭐ ⭐ ⭐ {rating} Ratings and Reviews {reviews}
        </div>

        {/* Title */}
        <h3 className="product-title">{title}</h3>

        {/* Description */}
        {/* <p className="product-description text-xs overflow-hidden text-ellipsis h-10">{description}</p> */}
        <p
          className="product-description text-sm text-[#5F5F5F] overflow-hidden font-montserrat mt-5"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            // fallback for non-webkit browsers
            textOverflow: "ellipsis",
          }}
          title={description}
        >

        {description}</p>

        <div className="flex  justify-center mt-2">
            <div className="w-[65%] mr-5">
            <HorizontalLine/>
            </div>
            <a href="#" className="view-details text-[#C7A040] text-xs text-montserrat">
            View Details
            </a>
        </div>
      </div>

      {/* Badge */}
      {/* {badge && ( */}
        <div className="badge h-12 flex  mt-5 bg-[#F4F4F4] items-center justify-around">
 

      
            <span className="text-[#ACACAC] text-xs">Earned Badge:</span>
         <img className="h-[35px] w-[30px]" src={"/badge.png"} alt="Badge" />
        </div>
      {/* )} */}
    </div>
  );
};

export default ProductCard;
