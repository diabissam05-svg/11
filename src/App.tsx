import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CmsProvider, useCms } from "./lib/store";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Calculator from "./pages/Calculator";
import Visualizer from "./pages/Visualizer";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function Layout({ children, hideChrome }: { children: React.ReactNode; hideChrome: boolean }) {
  if (hideChrome) return <>{children}</>;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { loading, loadError, reload } = useCms();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-onyx text-brand font-display text-xl uppercase tracking-widest"><span className="animate-pulse">Chargement de Dahra Motors…</span></div>;
  if (loadError) return <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-onyx px-4 text-center text-white"><p>{loadError}</p><button onClick={reload} className="rounded bg-brand px-6 py-3 font-bold text-black">Réessayer</button></div>;

  return (
    <Layout hideChrome={isAdmin}>
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/visualizer" element={<Visualizer />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <CmsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </CmsProvider>
  );
}
