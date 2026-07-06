import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import AIAssistant from "./components/AIAssistant";
import Emergency from "./components/Emergency";
import HowItWorks from "./components/HowItWorks";
import ReportIssue from "./components/ReportIssue";
import TrackIssue from "./components/TrackIssue";
import Footer from "./components/Footer";


function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <ReportIssue />
      <TrackIssue />
      <Features />
      <Stats /> 
       <Emergency />
      <AIAssistant />
      <Footer />
    </>
  );
}

export default App;