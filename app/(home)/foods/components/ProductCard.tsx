import React from "react";

type FoodCardProps = {
  image?: string;
  businessName: string; // updated
  businessDescription?: string; // updated
  badge?: string;
  logo?: string;
};

const HorizontalLine = () => {
  return (
    <p
      style={{
        borderTop: "1px solid",
        color: "#D9D9D9",
        margin: "10px 0",
      }}
    ></p>
  );
};


const getBadgeUrl = (badge?: string) => {
  if (!badge) return '';
  return `/badge/${badge
    .toLowerCase()
    .replace(/\s+/g, '-') // replace spaces with dash
    .replace(/[^a-z0-9-]/g, '') // remove any special characters
  }.png`;
};

const FoodCard: React.FC<FoodCardProps> = ({
  image,
  businessName,
  businessDescription,
  badge,
  logo,
}) => {
  return (
    <div className="product-card h-[420px] flex flex-col overflow-hidden border-2 border-[#D9D9D9] shadow-lg">
      
      {/* Image with logo overlay */}
      <div className="relative h-[180px] w-full flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={businessName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
            NO IMAGE
          </div>
        )}

        {logo && (
          <img
            src={logo}
            alt="Business Logo"
            className="absolute bottom-2 right-2 h-12 w-12 object-contain bg-white rounded-full p-1 shadow-md"
          />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        
        {/* Business Name */}
        <h3 className="text-base font-bold mb-2 line-clamp-1">
          {businessName}
        </h3>

        {/* Business Description */}
        <p
          className="text-sm text-[#5F5F5F] font-montserrat mb-3 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
          title={businessDescription}
        >
          {businessDescription || "\u00a0"}
        </p>

        {/* Divider + View details */}
        <div className="flex justify-center mt-auto">
          <div className="w-[65%] mr-5">
            <HorizontalLine />
          </div>

          <a
            href="#"
            className="text-[#C7A040] text-xs font-montserrat"
          >
            View Details
          </a>
        </div>

        {/* Badge Section */}
        <div className="mt-3 bg-gray-100 rounded px-4 py-2 flex justify-between items-center min-h-[64px]">
          
          <span className="text-gray-600 text-sm font-semibold">
            Earned Badge:
          </span>

{badge ? (
  <img
    src={getBadgeUrl(badge)}
    alt={`${badge} badge`}
    className="h-16 object-contain"
  />
) : (
  <div className="h-16 w-[96px]" />
)}

        </div>

      </div>
    </div>
  );
};

export default FoodCard;