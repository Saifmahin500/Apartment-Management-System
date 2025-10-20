import PublicLayout from "../../layout/PublicLayout";

export default function About() {
    return (
        <PublicLayout>
      <div className="p-10 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">About EasyHome</h1>
        <p className="text-gray-700 leading-relaxed mb-4">
          EasyHome is a modern apartment management platform designed to simplify rent,
          utility, and service operations. Whether you’re a tenant or an admin, our system ensures
          transparency and efficiency in managing apartment-related tasks.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Our Mission</h2>
        <p className="text-gray-600">
          To make apartment living smarter and management easier through automation and data-driven tools.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Our Vision</h2>
        <p className="text-gray-600">
          A connected community where all apartment-related services are just one click away.
        </p>
      </div>
      </PublicLayout>
    );
  }
  