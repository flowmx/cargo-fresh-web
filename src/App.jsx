import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Menu, X, Phone, Mail, MapPin, Anchor, Truck, Thermometer, 
  ShieldCheck, Clock, CheckCircle, Package, ArrowRight, 
  Calculator, DollarSign, Leaf, Users, ChevronDown, ChevronUp,
  Sparkles, Bot, Loader2, ArrowUp, Search, Map, Info, ArrowLeft,
  User, LogIn, LogOut, LayoutDashboard, FileText, Ship, MessageSquare, Send, 
  ClipboardCheck, AlertCircle, Check, Droplet, Snowflake, Box, ExternalLink
} from 'lucide-react';

/* LOGO URL */
// Usamos ruta relativa "./" para compatibilidad con GitHub Pages
const LOGO_URL = "./cargofreshlogo.svg"; 

/* ⚡ CONFIGURACIÓN DE TARIFAS */
const TARIFF_RATES = {
  baseCost: 800,
  perKg: 12,
  frozenMultiplier: 1.25,
  freshMultiplier: 1.10,
  dryMultiplier: 1.0,
  lastMileCost: 450,
  frequentClientDiscount: 0.15
};

/* 🧠 MOCK DATABASE */
const INITIAL_ORDERS = [
  { id: "ORD-001", client: "Pesquera del Mar", origin: "Mazatlán", dest: "La Paz", type: "Congelado", weight: 500, price: 6800, status: "Autorizado", date: "2024-05-10" },
  { id: "ORD-002", client: "Agro Sur", origin: "La Paz", dest: "Los Cabos", type: "Fresco", weight: 200, price: 3200, status: "En Ruta", date: "2024-05-11" },
];

/* GEMINI API UTILITIES */
const apiKey = ""; 

const generateGeminiContent = async (prompt) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

/* ------------------------------------------------
  COMPONENTE CARGOBOT
  ------------------------------------------------
*/
const CargoBot = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'system', text: "¡Hola! 👋 Soy CargoBot. ¿Tienes dudas sobre nuestras rutas o servicios?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    const prompt = `Eres CargoBot, asistente de Cargo Fresh. Responde breve en español. Usuario: ${userMsg}`;
    const responseText = await generateGeminiContent(prompt);
    
    if (responseText) {
      setMessages(prev => [...prev, { role: 'system', text: responseText }]);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
      setInput(e.target.value);
  };

  if (!isOpen) {
      return (
        <div className="fixed bottom-6 right-6 z-50">
            <button onClick={() => setIsOpen(true)} className="bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
            </button>
        </div>
      );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <div className="bg-white w-80 md:w-96 h-[400px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
          <div className="bg-blue-900 text-white p-3 flex justify-between items-center">
            <div className="flex items-center"><Bot className="w-5 h-5 mr-2" /><span className="font-bold text-sm">CargoBot</span></div>
            <button onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-lg p-2 text-xs ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700'}`}>{msg.text}</div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-gray-400 ml-2 flex items-center"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Escribiendo...</div>}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-2 bg-white border-t flex gap-2">
            <input 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Pregunta algo..." 
              className="flex-1 bg-gray-100 rounded-full px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500" 
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"><Send className="w-3 h-3" /></button>
          </form>
        </div>
        <button onClick={() => setIsOpen(false)} className="bg-blue-900 hover:bg-blue-800 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-110 flex items-center justify-center">
            <X className="w-6 h-6" />
        </button>
    </div>
  );
});

const ContactForm = () => {
    const [status, setStatus] = useState("idle");

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");
        setTimeout(() => {
            setStatus("sent");
            alert("¡Mensaje enviado correctamente! Nos pondremos en contacto contigo.");
            e.target.reset(); 
            setStatus("idle");
        }, 1500);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-blue-900 mb-6">Envíanos un mensaje</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                <input required type="text" className="w-full border rounded p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tu nombre" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo</label>
                <input required type="email" className="w-full border rounded p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="tucorreo@empresa.com" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mensaje</label>
                <textarea required rows="4" className="w-full border rounded p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>
            <button type="submit" disabled={status === "sending"} className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition flex justify-center items-center">
                {status === "sending" ? <Loader2 className="animate-spin w-5 h-5"/> : "Enviar Mensaje"}
            </button>
            </form>
        </div>
    );
};

/* ==============================================
   COMPONENTES DE VISTA
================================================ */

const LandingView = ({ setCurrentView, formData, handleInputChange, calculateEstimate, handleBuyNow, estimatedPrice }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [freshnessProduct, setFreshnessProduct] = useState("");
  const [freshnessResult, setFreshnessResult] = useState(null);
  const [isFreshnessLoading, setIsFreshnessLoading] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleFreshnessAnalysis = async () => {
    if (!freshnessProduct.trim()) return;
    setIsFreshnessLoading(true);
    setFreshnessResult(null);
    const prompt = `Experto logístico. Producto: "${freshnessProduct}". JSON output: { "temperature": "-18°C", "packaging": "Caja", "tips": "Tip breve" }`;
    const resultText = await generateGeminiContent(prompt);
    if (resultText) {
      try {
        const cleanedText = resultText.replace(/```json/g, '').replace(/```/g, '').trim();
        setFreshnessResult(JSON.parse(cleanedText));
      } catch (e) { console.error(e); }
    }
    setIsFreshnessLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-40 border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-24 flex justify-between items-center">
          <div className="flex flex-col cursor-pointer" onClick={scrollToTop}>
            <img 
              src={LOGO_URL} 
              alt="Cargo Fresh Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          
          <div className="hidden lg:flex space-x-8 items-center text-sm font-bold text-gray-600">
            <a href="#nosotros" className="hover:text-orange-500 transition">NOSOTROS</a>
            <a href="#servicios" className="hover:text-blue-900 transition">SERVICIOS</a>
            <a href="#rutas" className="hover:text-blue-900 transition">RUTAS</a>
            <a href="#cotizador" className="hover:text-orange-500 transition text-blue-900">COTIZADOR</a>
            <a href="#contacto" className="hover:text-blue-900 transition">CONTACTO</a>
            <button 
              onClick={() => setCurrentView('login')}
              className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-full flex items-center transition-all shadow-md transform hover:-translate-y-0.5"
            >
              <User className="w-4 h-4 mr-2" />
              Zona Clientes
            </button>
          </div>
          
          <button className="lg:hidden text-blue-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t p-4 space-y-4 shadow-lg absolute w-full z-50">
            <a href="#nosotros" className="block text-gray-700 font-bold p-2" onClick={() => setIsMenuOpen(false)}>Nosotros</a>
            <a href="#cotizador" className="block text-gray-700 font-bold p-2" onClick={() => setIsMenuOpen(false)}>Cotizador</a>
            <a href="#contacto" className="block text-gray-700 font-bold p-2" onClick={() => setIsMenuOpen(false)}>Contacto</a>
            <button onClick={() => setCurrentView('login')} className="w-full bg-blue-900 text-white py-3 rounded font-bold">Acceso Clientes</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 bg-blue-900 text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <img 
             src="./img_cargo_slide.jpg"
             alt="Buque de carga"
             className="w-full h-full object-cover opacity-50 mix-blend-multiply absolute inset-0"
           />
           <div className="absolute inset-0 bg-blue-900 mix-blend-multiply opacity-90"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase mb-6 shadow-lg tracking-wider">
              Logística Refrigerada Premium
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Frescura que Viaja <br/><span className="text-blue-200">Segura y Eficiente</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-lg">
              Facilitamos el transporte consolidado entre Sinaloa y Baja California Sur. Más económico que el aéreo, más rápido que el terrestre tradicional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#cotizador" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-bold shadow-xl transition transform hover:-translate-y-1 text-center">
                Cotizar Envío Ahora
              </a>
              <button 
                onClick={() => document.getElementById('rutas').scrollIntoView({behavior: 'smooth'})}
                className="bg-white/10 backdrop-blur border border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-900 transition flex items-center justify-center"
              >
                <Map className="w-5 h-5 mr-2" />
                Ver Cobertura
              </button>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-6">
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition duration-300 h-40 flex flex-col justify-center">
                <Thermometer className="w-8 h-8 text-cyan-300 mb-2" />
                <h3 className="font-bold text-lg">Control Térmico</h3>
                <p className="text-sm text-blue-100 mt-1">Monitoreo 24/7 de carga.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition duration-300 h-40 flex flex-col justify-center">
                <DollarSign className="w-8 h-8 text-green-300 mb-2" />
                <h3 className="font-bold text-lg">Costos Reducidos</h3>
                <p className="text-sm text-blue-100 mt-1">Tarifas consolidadas.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition duration-300 h-40 flex flex-col justify-center">
                <ShieldCheck className="w-8 h-8 text-yellow-300 mb-2" />
                <h3 className="font-bold text-lg">Carga Segura</h3>
                <p className="text-sm text-blue-100">Seguro opcional disponible.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition duration-300 h-40 flex flex-col justify-center">
                <Ship className="w-8 h-8 text-orange-300 mb-2" />
                <h3 className="font-bold text-lg">Ruta Marítima</h3>
                <p className="text-sm text-blue-100 mt-1">Conexión directa vía Ferry diario.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Propósito / Nosotros */}
      <section id="nosotros" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-500 font-bold tracking-widest text-sm uppercase">Sobre Nosotros</span>
              <h2 className="text-4xl font-bold text-blue-900 mb-6 mt-2">Nuestro Propósito</h2>
              <p className="text-xl text-gray-600 leading-relaxed italic border-l-4 border-orange-500 pl-6 mb-8">
                "Facilitar el transporte eficiente, seguro y accesible de carga refrigerada para productores, proveedores y distribuidores que necesiten mover alimentos desde pequeño a gran volumen."
              </p>
              <p className="text-gray-600 mb-6">
                En Cargo Fresh, entendemos que cada grado de temperatura cuenta. Nuestra misión es ser el puente de confianza entre el continente y la península, asegurando que tus productos lleguen tan frescos como salieron.
              </p>
            </div>
            
            <div className="flex items-center justify-center p-4"> 
              <img 
                src="./img_cargo_fresh_truck.png" 
                alt="Camión Cargo Fresh" 
                className="w-full max-w-md object-contain" 
              />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
             {['Responsabilidad', 'Confianza', 'Eficiencia', 'Sustentabilidad'].map((val, i) => (
               <div key={i} className="flex flex-col items-center p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition transform hover:-translate-y-1 h-full">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-blue-900 shadow-md">
                   <CheckCircle className="w-8 h-8" />
                 </div>
                 <span className="font-bold text-gray-800 text-lg">{val}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section id="proceso" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">¿Cómo funciona Cargo Fresh?</h2>
            <p className="text-gray-600">Tu logística simplificada en 5 pasos.</p>
          </div>
          <div className="relative hidden md:block border-t-2 border-dashed border-gray-300 top-16 mx-12 -z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { title: "Recepción", icon: <Package/>, desc: "Recibimos tu carga en Mazatlán o La Paz." },
              { title: "Consolidación", icon: <Box/>, desc: "Organizamos y aseguramos la temperatura." },
              { title: "Transporte", icon: <Ship/>, desc: "Cruce marítimo seguro vía Ferry." },
              { title: "Descarga", icon: <Truck/>, desc: "Manejo cuidadoso en puerto destino." },
              { title: "Entrega", icon: <MapPin/>, desc: "Última milla hasta tu puerta (Opcional)." }
            ].map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group z-10 h-full">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white group-hover:border-orange-500 transition-all duration-300 mb-6 shrink-0">
                  <div className="text-blue-900 group-hover:text-orange-500 transition-colors">
                    {React.cloneElement(step.icon, { size: 40 })}
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 px-2">{step.desc}</p>
                </div>
                <div className="mt-4 w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm shrink-0">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de Carga */}
      <section id="servicios" className="py-24 relative overflow-hidden bg-gray-900 text-white">
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40 mix-blend-multiply" style={{ backgroundImage: "url('./img_cargo_slide.jpg')" }}></div>
        <div className="absolute inset-0 bg-blue-950/80 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tipos de Carga que Manejamos</h2>
            <p className="text-blue-200">Adaptamos nuestros contenedores para cada necesidad.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Carga Fresca */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:bg-white/20 transition duration-300 h-full flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src="./carga_fresca_verduras.jpg" alt="Frutas y Verduras" className="w-full h-full object-cover transform hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <Droplet className="w-8 h-8 text-blue-400 mr-3" />
                  <h3 className="text-2xl font-bold">Carga Fresca</h3>
                </div>
                <p className="text-blue-100 mb-4 text-sm">Mantenimiento preciso entre 0°C y 4°C para conservar la vida de anaquel.</p>
                <ul className="space-y-2 text-sm text-blue-200 mt-auto">
                  <li>• Frutas y Verduras</li>
                  <li>• Lácteos y Derivados</li>
                  <li>• Flores y Plantas</li>
                </ul>
              </div>
            </div>
            {/* Carga Congelada */}
            <div className="bg-blue-600/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-blue-500 hover:bg-blue-600 transition duration-300 h-full flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src="./carga_congelada_carnes.jpg" alt="Congelados" className="w-full h-full object-cover transform hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <Snowflake className="w-8 h-8 text-cyan-300 mr-3" />
                  <h3 className="text-2xl font-bold text-white">Carga Congelada</h3>
                </div>
                <p className="text-blue-50 mb-4 text-sm">Temperaturas bajo cero constantes (-18°C) sin interrupciones en la cadena.</p>
                <ul className="space-y-2 text-sm text-blue-100 mt-auto">
                  <li>• Mariscos y Pescados</li>
                  <li>• Carnes Rojas y Aves</li>
                  <li>• Helados y Hielo</li>
                </ul>
              </div>
            </div>
            {/* Carga Seca */}
            <div className="bg-orange-600/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-orange-500 hover:bg-orange-600 transition duration-300 h-full flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img src="./carga_seca_abarrotes.jpg" alt="Carga Seca" className="w-full h-full object-cover transform hover:scale-110 transition duration-500" />
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center mb-4">
                  <Box className="w-8 h-8 text-white mr-3" />
                  <h3 className="text-2xl font-bold text-white">Carga Seca</h3>
                </div>
                <p className="text-orange-50 mb-4 text-sm">Transporte seguro y eficiente para mercancía que no requiere refrigeración.</p>
                <ul className="space-y-2 text-sm text-orange-100 mt-auto">
                  <li>• Abarrotes y Enlatados</li>
                  <li>• Material de Empaque</li>
                  <li>• Mercancía General</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rutas */}
      <section id="rutas" className="py-20 bg-gray-50 text-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6 border-l-4 border-orange-500 pl-4 text-blue-900">Cobertura Estratégica</h2>
            <p className="text-gray-600 mb-8 text-lg">Unimos el continente con la península a través del Mar de Cortés, ofreciendo la ruta más eficiente para tus perecederos.</p>
            <div className="space-y-6">
              <div className="flex items-start">
                <Anchor className="w-6 h-6 text-orange-500 mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Ruta Marítima Principal</h4>
                  <p className="text-gray-500">Mazatlán, Sin. ↔ La Paz, BCS.</p>
                  <p className="text-xs text-blue-600 mt-1">Salidas diarias nocturnas.</p>
                </div>
              </div>
              <div className="flex items-start">
                <Truck className="w-6 h-6 text-orange-500 mr-4 mt-1" />
                <div>
                  <h4 className="font-bold text-lg">Conexión Terrestre (Última Milla)</h4>
                  <p className="text-gray-500">La Paz ↔ Los Cabos.</p>
                  <p className="text-xs text-blue-600 mt-1">Entrega puerta a puerta disponible.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full">
             <div className="bg-blue-900 text-white rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold mb-4 flex items-center"><Sparkles className="w-5 h-5 text-yellow-400 mr-2"/> Asistente IA de Empaque</h3>
                <p className="text-sm text-blue-200 mb-4">¿No sabes qué temperatura necesita tu producto? Pregunta aquí.</p>
                <div className="flex gap-2">
                  <input value={freshnessProduct} onChange={e => setFreshnessProduct(e.target.value)} type="text" placeholder="Ej. Fresas..." className="flex-1 rounded px-3 py-2 text-black text-sm outline-none" />
                  <button onClick={handleFreshnessAnalysis} className="bg-orange-500 px-4 py-2 rounded font-bold text-sm hover:bg-orange-600 transition">
                    {isFreshnessLoading ? <Loader2 className="animate-spin w-4 h-4"/> : "Ver Info"}
                  </button>
                </div>
                {freshnessResult && (
                  <div className="mt-4 bg-white/10 p-3 rounded text-sm animate-fade-in border-l-2 border-green-400">
                    <p className="font-bold text-green-400 mb-1">Resultado:</p>
                    <p>🌡️ {freshnessResult.temperature}</p>
                    <p>📦 {freshnessResult.packaging}</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </section>

      {/* COTIZADOR PÚBLICO */}
      <section id="cotizador" className="py-20 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-200 flex flex-col md:flex-row gap-12 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="flex-1 relative z-10">
              <span className="text-orange-600 font-bold uppercase text-xs tracking-wider mb-2 block">Calculadora de Tarifas</span>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Cotiza tu Envío Rápido</h2>
              <p className="text-gray-600 mb-6">Obtén un estimado inmediato. Para formalizar la orden y asegurar el espacio, deberás iniciar sesión.</p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Origen</label>
                    <select name="origin" value={formData.origin} onChange={handleInputChange} className="w-full border rounded p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none block"><option value="">Sel...</option><option value="Mazatlán">Mazatlán</option><option value="La Paz">La Paz</option></select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Destino</label>
                    <select name="destination" value={formData.destination} onChange={handleInputChange} className="w-full border rounded p-3 bg-white focus:ring-2 focus:ring-blue-500 outline-none block"><option value="">Sel...</option><option value="La Paz">La Paz</option><option value="Los Cabos">Los Cabos</option></select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Tipo de Carga</label>
                      <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border rounded p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 block"><option value="">Tipo...</option><option value="Fresco">Fresco</option><option value="Congelado">Congelado</option><option value="Seco">Seco</option></select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Peso (Kg)</label>
                      <input type="text" inputMode="decimal" placeholder="Ej. 150.5" name="weight" value={formData.weight} onChange={handleInputChange} className="w-full border rounded p-3 outline-none focus:ring-2 focus:ring-blue-500 block" />
                    </div>
                </div>
                <button onClick={calculateEstimate} className="w-full bg-blue-100 text-blue-900 font-bold py-3 rounded hover:bg-blue-200 transition">Calcular Estimado</button>
              </form>
            </div>
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-xl border-t-4 border-orange-500 w-full text-center relative z-10">
              {estimatedPrice ? (
                <>
                  <p className="text-gray-500 uppercase text-xs font-bold mb-2">Inversión Estimada</p>
                  <p className="text-4xl font-black text-blue-900 mb-2">${estimatedPrice.min.toLocaleString()}</p>
                  <p className="text-sm text-gray-400 mb-6">MXN + IVA</p>
                  <button onClick={handleBuyNow} className="w-full bg-orange-500 text-white py-4 rounded-lg font-bold hover:bg-orange-600 shadow-lg animate-pulse transition">
                    CONTRATAR / RESERVAR
                  </button>
                  <p className="text-xs text-gray-400 mt-4 flex items-center justify-center">
                    <User className="w-3 h-3 mr-1"/> Se requiere inicio de sesión
                  </p>
                </>
              ) : (
                <div className="text-gray-400 py-8 flex flex-col items-center justify-center h-full">
                  <Calculator className="w-16 h-16 mb-4 opacity-10"/>
                  <p className="text-lg font-medium">Ingresa tus datos para ver precios al instante.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Contáctanos</h2>
            <p className="text-gray-600">Déjanos un mensaje y te responderemos a la brevedad.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="grid gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4"><MapPin className="text-blue-900 w-6 h-6"/></div>
                <div>
                  <h4 className="font-bold text-gray-800">Mazatlán, Sinaloa</h4>
                  <p className="text-sm text-gray-500">Recinto Portuario Fiscalizado</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4"><MapPin className="text-blue-900 w-6 h-6"/></div>
                <div>
                  <h4 className="font-bold text-gray-800">La Paz, BCS</h4>
                  <p className="text-sm text-gray-500">Parque Industrial Sur, Bodega 4</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center border-l-4 border-orange-500">
                <div className="bg-orange-100 p-3 rounded-full mr-4"><Phone className="text-orange-600 w-6 h-6"/></div>
                <div>
                  <h4 className="font-bold text-gray-800">Atención Telefónica</h4>
                  <p className="text-sm text-gray-500">Lunes a Sábado: 8:00 AM - 6:00 PM</p>
                  <p className="font-bold text-blue-900">(669) 990 0000</p>
                </div>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12 border-t border-blue-900">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <img src={LOGO_URL} alt="Cargo Fresh Logo Footer" className="h-12 w-auto object-contain mb-2 brightness-0 invert opacity-90 mx-auto md:mx-0"/>
            <p className="text-blue-400 text-sm mt-1">Logística inteligente para productos sensibles.</p>
          </div>
          <div className="flex space-x-6 text-sm text-blue-300">
            <a href="#" className="hover:text-white transition">Aviso de Privacidad</a>
            <a href="#" className="hover:text-white transition">Términos y Condiciones</a>
            <button onClick={() => setCurrentView('login')} className="hover:text-white transition underline">Acceso Administrativo</button>
          </div>
        </div>
        <div className="text-center text-xs text-blue-500 mt-8">
          &copy; 2025 Cargo Fresh S.A. de C.V. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

const LoginView = ({ setCurrentView, pendingQuote, handleLogin }) => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 relative overflow-hidden animate-fade-in-up">
        {pendingQuote && (
          <div className="bg-orange-100 text-orange-800 text-xs font-bold p-2 text-center absolute top-0 left-0 w-full flex items-center justify-center">
            <AlertCircle className="w-3 h-3 mr-1"/> ¡Tienes una cotización pendiente!
          </div>
        )}
        <div className="text-center mb-8 mt-6">
          <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
            <User className="w-8 h-8 text-blue-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Bienvenido de nuevo</h2>
          <p className="text-gray-500 text-sm mt-2">Gestiona tus pedidos y rastrea tu carga.</p>
        </div>
        <div className="space-y-4">
          <button onClick={() => handleLogin('client')} className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-4 rounded-lg shadow-lg flex items-center justify-center transition transform hover:scale-[1.02]">
            <User className="w-5 h-5 mr-3"/> Soy Cliente
          </button>
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">ACCESO INTERNO</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <button onClick={() => handleLogin('admin')} className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg shadow flex items-center justify-center border border-gray-700 transition">
            <ShieldCheck className="w-5 h-5 mr-3"/> Soy Administrador
          </button>
        </div>
        <div className="mt-8 text-center">
          <button onClick={() => setCurrentView('landing')} className="text-sm text-gray-500 hover:text-blue-900 underline font-medium">
            ← Regresar a la página principal
          </button>
        </div>
      </div>
    </div>
);

const ClientDashboard = ({ user, handleLogout, pendingQuote, handleCreateOrder, setPendingQuote, orders }) => (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center">
            <LayoutDashboard className="w-6 h-6 text-orange-500 mr-2" />
            <span className="font-bold text-gray-800 text-lg">Portal Cliente</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
               <span className="block text-sm font-bold text-blue-900">{user.name}</span>
               <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Cliente Frecuente</span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><LogOut className="w-5 h-5"/></button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {pendingQuote && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center animate-fade-in-down shadow-sm">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-orange-800 flex items-center text-lg"><AlertCircle className="w-5 h-5 mr-2"/> Finalizar Orden Pendiente</h3>
              <p className="text-sm text-orange-700 mt-1">{pendingQuote.origin} ➝ {pendingQuote.destination} • {pendingQuote.weight}kg {pendingQuote.type}</p>
              <p className="text-2xl font-black text-orange-900 mt-2">${pendingQuote.price.toLocaleString()} MXN</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => setPendingQuote(null)} className="px-4 py-2 text-sm text-orange-700 font-bold hover:bg-orange-100 rounded w-full md:w-auto">Descartar</button>
              <button onClick={handleCreateOrder} className="bg-orange-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-orange-600 shadow-lg w-full md:w-auto">Confirmar Pedido</button>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
               <div className="text-gray-400 text-xs font-bold uppercase mb-1">Pedidos Activos</div>
               <div className="text-3xl font-black text-blue-900">{orders.filter(o => o.status !== 'Entregado').length}</div>
            </div>
            <Package className="w-10 h-10 text-blue-100"/>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
               <div className="text-gray-400 text-xs font-bold uppercase mb-1">Por Autorizar</div>
               <div className="text-3xl font-black text-orange-500">{orders.filter(o => o.status === 'Pendiente de Autorización').length}</div>
            </div>
            <Clock className="w-10 h-10 text-orange-100"/>
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Historial de Pedidos</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="p-4 font-bold">ID Orden</th>
                  <th className="p-4 font-bold">Ruta</th>
                  <th className="p-4 font-bold">Detalle</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-blue-900">{order.id}</td>
                    <td className="p-4">{order.origin} <span className="text-gray-400 mx-1">➝</span> {order.dest}</td>
                    <td className="p-4">{order.weight}kg <span className="text-xs bg-gray-100 px-2 py-0.5 rounded ml-1 text-gray-600">{order.type}</span></td>
                    <td className="p-4 font-medium">${order.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'Autorizado' ? 'bg-green-100 text-green-700 border-green-200' : order.status === 'Pendiente de Autorización' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
        </div>
      </main>
    </div>
);

const AdminDashboard = ({ handleLogout, orders, handleAuthorizeOrder }) => (
    <div className="min-h-screen bg-gray-900 flex flex-col text-gray-100">
      <header className="bg-gray-800 shadow-lg sticky top-0 z-30 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center">
            <ShieldCheck className="w-6 h-6 text-green-400 mr-2" />
            <span className="font-bold text-white tracking-wide">Panel Administrativo</span>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white flex items-center text-sm transition">
            Cerrar Sesión <LogOut className="w-4 h-4 ml-2"/>
          </button>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Gestión de Pedidos</h2>
            <p className="text-gray-400 mt-1">Visualiza y autoriza las órdenes entrantes.</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-900 text-gray-400 border-b border-gray-700 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-5">ID</th>
                <th className="p-5">Cliente</th>
                <th className="p-5">Detalle Carga</th>
                <th className="p-5 text-right">Valor</th>
                <th className="p-5">Estatus</th>
                <th className="p-5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-750 transition-colors">
                  <td className="p-5 font-mono text-blue-300">{order.id}</td>
                  <td className="p-5 font-bold text-white">{order.client}</td>
                  <td className="p-5 text-gray-300">
                    <div className="flex items-center gap-2 mb-1">
                       <span>{order.origin}</span>
                       <ArrowRight className="w-3 h-3 text-gray-500"/>
                       <span>{order.dest}</span>
                    </div>
                    <div className="text-xs opacity-60 bg-gray-700 inline-block px-2 py-0.5 rounded">{order.weight}kg • {order.type}</div>
                  </td>
                  <td className="p-5 text-right font-mono text-green-300 font-bold">${order.price.toLocaleString()}</td>
                  <td className="p-5">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'Pendiente de Autorización' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-5 text-center">
                    {order.status === 'Pendiente de Autorización' ? (
                      <button onClick={() => handleAuthorizeOrder(order.id)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded text-xs font-bold flex items-center mx-auto transition shadow-lg transform hover:scale-105">
                        <Check className="w-3 h-3 mr-1" /> Autorizar
                      </button>
                    ) : (
                      <span className="text-gray-500 text-xs flex justify-center items-center"><ClipboardCheck className="w-4 h-4 mr-1"/> Procesado</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
        </div>
      </main>
    </div>
);

/* ------------------------------------------------
  COMPONENTE APP PRINCIPAL
  ------------------------------------------------
*/
const App = () => {
  // --- STATE ---
  const [currentView, setCurrentView] = useState('landing'); 
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [pendingQuote, setPendingQuote] = useState(null);
  const [formData, setFormData] = useState({ origin: "", destination: "", type: "", presentation: "", weight: "", lastMile: false });
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  const handleLogin = (role) => {
    if (role === 'client') {
      setUser({ name: "Cliente Demo S.A.", role: 'client' });
      setCurrentView('client-dashboard');
    } else {
      setUser({ name: "Administrador CargoFresh", role: 'admin' });
      setCurrentView('admin-dashboard');
    }
    window.scrollTo(0,0);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setPendingQuote(null);
    window.scrollTo(0,0);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (['type', 'origin', 'destination', 'lastMile'].includes(name)) {
      setEstimatedPrice(null);
    }
  };

  const calculateEstimate = (e) => {
    e?.preventDefault();
    if (!formData.weight || !formData.type) {
      alert("Ingresa peso y tipo de carga.");
      return;
    }
    const cleanWeight = formData.weight.toString().replace(',', '.');
    const weight = parseFloat(cleanWeight);
    if (isNaN(weight) || weight <= 0) {
        alert("Por favor ingresa un peso válido (mayor a 0).");
        return;
    }
    let total = TARIFF_RATES.baseCost + (weight * TARIFF_RATES.perKg);
    if (formData.type === 'Congelado') total *= TARIFF_RATES.frozenMultiplier;
    if (formData.type === 'Fresco') total *= TARIFF_RATES.freshMultiplier;
    if (formData.lastMile) total += TARIFF_RATES.lastMileCost;
    const min = Math.round(total * 0.95);
    const max = Math.round(total * 1.05);
    setEstimatedPrice({ min, max });
  };

  const handleBuyNow = () => {
    calculateEstimate();
    if (estimatedPrice) {
        setPendingQuote({ ...formData, price: estimatedPrice.min });
        setCurrentView('login');
        window.scrollTo(0,0);
    }
  };
  
  const handleCreateOrder = () => {
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      client: user.name,
      origin: pendingQuote ? pendingQuote.origin : formData.origin,
      dest: pendingQuote ? pendingQuote.destination : formData.destination,
      type: pendingQuote ? pendingQuote.type : formData.type,
      weight: pendingQuote ? pendingQuote.weight : formData.weight,
      price: pendingQuote ? pendingQuote.price : estimatedPrice?.min || 0,
      status: "Pendiente de Autorización",
      date: new Date().toISOString().split('T')[0]
    };
    setOrders([newOrder, ...orders]);
    setPendingQuote(null);
    alert("¡Pedido creado exitosamente!");
  };

  const handleAuthorizeOrder = (orderId) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status: "Autorizado" } : order));
  };

  return (
    <>
      {currentView === 'landing' && 
        <LandingView 
            setCurrentView={setCurrentView} 
            formData={formData} 
            handleInputChange={handleInputChange} 
            calculateEstimate={calculateEstimate} 
            handleBuyNow={handleBuyNow} 
            estimatedPrice={estimatedPrice} 
        />}
      {currentView === 'login' && 
        <LoginView 
            setCurrentView={setCurrentView} 
            pendingQuote={pendingQuote} 
            handleLogin={handleLogin} 
        />}
      {currentView === 'client-dashboard' && 
        <ClientDashboard 
            user={user} 
            handleLogout={handleLogout} 
            pendingQuote={pendingQuote} 
            handleCreateOrder={handleCreateOrder} 
            setPendingQuote={setPendingQuote} 
            orders={orders} 
        />}
      {currentView === 'admin-dashboard' && 
        <AdminDashboard 
            handleLogout={handleLogout} 
            orders={orders} 
            handleAuthorizeOrder={handleAuthorizeOrder} 
        />}
      <CargoBot />
    </>
  );
};

export default App;