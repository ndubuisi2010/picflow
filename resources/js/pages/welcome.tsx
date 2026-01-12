import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
    photos,
    consumer,
}: {
    canRegister?: boolean;
    photos:[],
    consumer:boolean
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
     

      {/* ================= JUMBOTRON ================= */}
      <section className="bg-gray-900">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 items-center gap-6 p-6 md:p-16">
          <div className="text-white">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              Welcome to <span className="text-orange-400">Pixora</span>
            </h1>
            <p className="mt-6 text-gray-300 text-lg md:text-xl">
              Explore stunning photos, discover creators, and transform your visual experience.
              Join our community and be part of something beautiful.
            </p>
            {canRegister && (
              <Link
                href="/register"
                className="inline-block mt-8 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-semibold transition"
              >
                Get Started
              </Link>
            )}
          </div>
          <img
            src="/waterfall.jpeg"
            alt="Pixora Hero"
            className="w-full h-80 md:h-full object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* ================= ABOUT PIXORA ================= */}
      <section className="py-16 w-full bg-gray-50 dark:bg-transparent dark:text-white">
        <div className="  px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 dark:text-white">
            About Pixora
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto dark:text-gray-100">
            Pixora is your ultimate platform for discovering amazing photos from talented creators
            worldwide. Browse, collect, and enjoy high-quality visuals across all genres.
          </p>
        </div>
      </section>

      {/* ================= BANNER / CTA ================= */}
      <section className=" w-full py-16">
        <div className=" px-6">
          <div className="rounded-2xl bg-gradient-to-r from-purple-100 via-pink-100 to-purple-50 px-8 py-12 sm:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Discover Amazing Photos
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Transform your experience with our innovative solutions
            </p>
           
          </div>
        </div>
      </section>

      {/* ================= FIRST 10 PHOTOS ================= */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            Latest Photos
          </h2>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-lg shadow-lg hover:scale-105 transition transform cursor-pointer"
              >
                <img
                  src={photo.thumbnail}
                  alt={photo.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-2 bg-white text-gray-800 text-center font-medium">
                  {photo.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            </div>
        </>
    );
}
