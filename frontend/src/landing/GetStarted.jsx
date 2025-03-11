import { Link } from "react-router-dom";


export default function GetStarted() {
    return (
        <>
            <div className="relative flex items-center justify-center min-h-screen p-8 overflow-hidden bg-gradient-to-br from-[#ffffff] to-[#fefeef]">
                <div
                    className="absolute inset-0 bg-center bg-cover opacity-20 mix-blend-overlay"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#ffffff] to-[#fffefee] mix-blend-multiply" />
                <div className="relative z-10  w-full max-w-7xl">
                    <Card
                        title="Patient"
                        description="Access your personal account and manage your individual profile. Join our community of users and unlock exclusive features."
                        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                    >
                       <div className="w-full flex justify-around">
                       <Button href="/auth/patient/signup">Sign Up</Button>
                       <Button href="/auth/signin">Sign In</Button>
                       </div>
                    </Card>
                </div>
            </div>

        </>
    );
}

function Card({
    title,
    description,
    image,
    children,
}) {
    return (
        <div className="flex  flex-col overflow-hidden bg-white shadow-2xl bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl">
            <div className="relative h-64">
                <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url(${image || "/placeholder.svg"})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <h2 className="absolute text-4xl font-bold text-white bottom-4 left-6">
                    {title}
                </h2>
            </div>
            <div className="flex flex-col flex-grow p-8">
                <p className="flex-grow mb-8 text-black">{description}</p>
                <div className="flex flex-col gap-4 sm:flex-row">{children}</div>
            </div>
        </div>
    );
}

function Button({
    href,
    children,
    variant = "solid",
}) {

    const baseClasses =
        "px-6 py-3 rounded-full font-semibold text-center transition-all duration-300 w-full sm:w-auto transform hover:scale-105 active:scale-95 shadow-md";
    const variantClasses =
        variant === "solid"
            ? "bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white hover:from-purple-700 hover:via-pink-600 hover:to-red-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            : "bg-white/10 border-2 border-white text-white hover:bg-white/20 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2";

    return (
        <Link to={href} className={`${baseClasses} ${variantClasses}`}>
            {children}
        </Link>
    );
}
