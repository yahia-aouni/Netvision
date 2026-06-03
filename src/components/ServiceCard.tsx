import React from 'react';
import { Link } from 'react-router-dom';
const ServiceCard: React.FC<{ service: any }> = ({ service }) => {
  return (
    <Link to={`/services/${service.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm card-hover h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <span className="absolute top-3 right-3 badge badge-primary bg-white/90">{service.category}</span>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <img src={service.seller.avatar} alt={service.seller.name} className="w-8 h-8 rounded-full" />
            <div><p className="text-sm font-medium">{service.seller.name}</p><div className="flex items-center gap-1 text-yellow-500 text-sm"><span>★</span><span>{service.rating}</span><span className="text-gray-400">({service.reviewsCount})</span></div></div>
          </div>
          <h3 className="text-text-primary font-medium line-clamp-2 mb-3 flex-1">{service.title}</h3>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-400">{service.deliveryTime.basic} أيام</span>
            <div><span className="text-xs text-gray-400">من</span><p className="text-lg font-bold text-primary">${service.price.basic}</p></div>
          </div>
        </div>
      </div>
    </Link>
  );
};
export default ServiceCard;