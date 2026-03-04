import { Link } from "react-router-dom";

function FloatingCard({
  title,
  to = "#",
  rotate = "",
  children, 
}) {
  return (
    <Link
      to={to}
      className={`
        ${rotate}
        w-[180px] h-[220px]
        rounded-2xl
        bg-gray-50
        border border-slate-200
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        p-4
        flex flex-col
        transition
        hover:shadow-md hover:-translate-y-1
      `}
    >
      {/* Title */}
      <p className="text-sm font-medium text-slate-800 mb-3">
        {title}
      </p>

      {/* Card Content */}
      <div className="flex-1 flex items-center justify-center">
        {children}
      </div>
    </Link>
  );
}

export default FloatingCard;
