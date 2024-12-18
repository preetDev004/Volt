import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export function Hero() {
  return (
    <div className="text-center">
    <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
      <div className="relative">
        {/* <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-purple-400 opacity-75 blur-3xl"></div> */}
        <p className="relative mb-4 text-5xl sm:text-7xl font-bold  text-white" style={{
          textShadow:
            "0 0 0px #fff, 0 0 10px #fff, 0 0 10px #9f7aea, 0 0 10px #9f7aea, 0 0 50px #6b46c1, 0 0 20px #6b46c1, 0 0 80px #6b46c1",
        }}>
          <span className="glow-purple bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
          v<span className="text-purple-500 font-semibold">O</span>lt
          </span>
        </p>
      </div>
      
      <p className="glow-white mb-8 text-2xl sm:text-6xl font-bold text-white/90">
        Powering the future of innovation
      </p>
      
      <p className="mx-auto mb-12 max-w-2xl text-base sm:text-lg text-gray-400">
        Experience lightning-fast performance and cutting-edge technology 
        that transforms the way you work and create apps.
      </p>

      <div className="flex justify-center gap-4">
        <a href="/chat"><Button className="bg-purple-600 text-white hover:bg-purple-500 active:bg-purple-700" >Get Started <ArrowRight/></Button></a>
      </div>
    </div>
  );
}