import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Menu, X, Phone, Mail, MapPin, Anchor, Truck, Thermometer, 
  ShieldCheck, Clock, CheckCircle, Package, ArrowRight, 
  Calculator, DollarSign, Leaf, Users, ChevronDown, ChevronUp,
  Sparkles, Bot, Loader2, ArrowUp, Search, Map, Info, ArrowLeft,
  User, LogIn, LogOut, LayoutDashboard, FileText, Ship, MessageSquare, Send, 
  ClipboardCheck, AlertCircle, Check, Droplet, Snowflake, Box, ExternalLink,
  Laptop, Lock
} from 'lucide-react';

/* LOGO URL */
// Usamos ruta relativa "./" para compatibilidad con GitHub Pages
const LOGO_URL = "./cargofreshlogo.svg"; 

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

    const prompt = `Eres CargoBot, asistente de Cargo Fresh. Responde breve en español. El usuario no puede cotizar en la web, debe contactar por teléfono o correo. Usuario: ${userMsg}`;
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
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState("idle");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("sending");
        
        // Simulación de envío y apertura de cliente de correo
        setTimeout(() => {
            const subject = encodeURIComponent(`Nuevo Mensaje de Contacto Web: ${formData.name}`);
            const body = encodeURIComponent(`Nombre: ${formData.name}\nCorreo: ${formData.email}\n\nMensaje:\n${formData.message}`);
            
            // Abre el cliente de correo del usuario
            window.location.href = `mailto:contacto@cargofresh.com.mx?subject=${subject}&body=${body}`;
            
            setStatus("sent");
            alert("Se abrirá tu cliente de correo para enviar el mensaje.");
            setFormData({ name: "", email: "", message: "" }); // Limpiar formulario
            setStatus("idle");
        }, 1000);
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-blue-900 mb-6">Envíanos un mensaje</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                <input 
                    required 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Tu nombre" 
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo</label>
                <input 
                    required 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="tucorreo@empresa.com" 
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mensaje</label>
                <textarea 
                    required 
                    rows="4" 
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border rounded p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="¿En qué podemos ayudarte?"
                ></textarea>
            </div>
            <button type="submit" disabled={status === "sending"} className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition flex justify-center items-center">
                {status === "sending" ? <Loader2 className="animate-spin w-5 h-5"/> : "Enviar Mensaje"}
            </button>
            </form>
        </div>
    );
};

/* ==============================================
   VISTA PÚBLICA (LANDING) MODIFICADA
================================================ */

const LandingView = () => {
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
      {/* Navbar Simplificada */}
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
            <a href="#contacto" className="hover:text-blue-900 transition">CONTACTO</a>
          </div>
          
          <button className="lg:hidden text-blue-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t p-4 space-y-4 shadow-lg absolute w-full z-50">
            <a href="#nosotros" className="block text-gray-700 font-bold p-2" onClick={() => setIsMenuOpen(false)}>Nosotros</a>
            <a href="#servicios" className="block text-gray-700 font-bold p-2" onClick={() => setIsMenuOpen(false)}>Servicios</a>
            <a href="#contacto" className="block text-gray-700 font-bold p-2" onClick={() => setIsMenuOpen(false)}>Contacto</a>
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

      {/* PLATAFORMA - PRÓXIMAMENTE (Reemplaza Cotizador) */}
      <section id="plataforma" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 md:p-16 shadow-2xl border border-blue-800 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-6 shadow-lg tracking-wider">
                <Clock className="w-3 h-3 mr-1" /> Próximamente
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
                Plataforma Integral de <span className="text-orange-400">Logística Inteligente</span>
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Estamos desarrollando un portal exclusivo para nuestros clientes. Muy pronto podrás cotizar al instante, programar recolecciones y verificar el estatus de tus envíos en tiempo real, todo desde un solo lugar.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <div className="flex items-center bg-white/10 px-4 py-3 rounded-lg border border-white/20">
                    <Laptop className="w-6 h-6 text-cyan-400 mr-3" />
                    <div className="text-left">
                        <span className="block font-bold text-sm">Cotizador Web</span>
                        <span className="text-xs text-blue-200">Precios al instante</span>
                    </div>
                </div>
                <div className="flex items-center bg-white/10 px-4 py-3 rounded-lg border border-white/20">
                    <Search className="w-6 h-6 text-orange-400 mr-3" />
                    <div className="text-left">
                        <span className="block font-bold text-sm">Rastreo GPS</span>
                        <span className="text-xs text-blue-200">Ubicación real</span>
                    </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative z-10 flex justify-center">
                <div className="relative">
                    <div className="absolute -inset-4 bg-orange-500/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl max-w-sm">
                        <div className="flex items-center justify-center mb-6">
                             <div className="bg-blue-800 p-4 rounded-full">
                                <Lock className="w-12 h-12 text-white" />
                             </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Zona de Clientes</h3>
                        <p className="text-sm text-blue-200 mb-6">Acceso seguro y personalizado para gestionar toda tu operación logística.</p>
                        <div className="w-full h-2 bg-blue-950 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500 w-3/4 rounded-full animate-[width_2s_ease-in-out_infinite]"></div>
                        </div>
                        <p className="text-xs text-center text-orange-400 mt-2 font-mono">EN DESARROLLO...</p>
                    </div>
                </div>
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
            <span className="text-gray-500 cursor-not-allowed">Acceso Administrativo</span>
          </div>
        </div>
        <div className="text-center text-xs text-blue-500 mt-8">
          &copy; 2025 Cargo Fresh S.A. de C.V. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

/* ------------------------------------------------
  COMPONENTE PRINCIPAL QUE SOLO RENDERIZA LA LANDING
  (Mantenemos estructura simple para esta versión)
  ------------------------------------------------
*/
const App = () => {
  return (
    <>
      <LandingView />
      <CargoBot />
    </>
  );
};

export default App;