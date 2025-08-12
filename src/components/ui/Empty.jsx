import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding some content.", 
  actionLabel = "Add Item",
  onAction 
}) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
          <ApperIcon name="Package" className="w-10 h-10 text-primary-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          {title}
        </h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;