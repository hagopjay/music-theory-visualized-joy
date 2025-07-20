import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleOfFifths } from "@/components/CircleOfFifths";
import { IntervalGeometry } from "@/components/IntervalGeometry";
import { ModeExplorer } from "@/components/ModeExplorer";
import { ChordProgressionAnalyzer } from "@/components/ChordProgressionAnalyzer";
import { Music, Circle, Layers, GitBranch } from "lucide-react";

const Index = () => {
  const [activeView, setActiveView] = useState<'circle' | 'intervals' | 'modes' | 'chords'>('circle');

  const views = [
    {
      id: 'circle' as const,
      title: 'Circle of Fifths',
      subtitle: 'The foundation of harmonic relationships',
      icon: Circle,
      component: CircleOfFifths
    },
    {
      id: 'intervals' as const,
      title: 'Interval Geometry',
      subtitle: 'How intervals create mathematical patterns',
      icon: GitBranch,
      component: IntervalGeometry
    },
    {
      id: 'modes' as const,
      title: 'Modal Exploration',
      subtitle: 'Seven colors of the musical spectrum',
      icon: Layers,
      component: ModeExplorer
    },
    {
      id: 'chords' as const,
      title: 'Harmonic Analysis',
      subtitle: 'Decode the secrets of chord progressions',
      icon: Music,
      component: ChordProgressionAnalyzer
    }
  ];

  const ActiveComponent = views.find(view => view.id === activeView)?.component || CircleOfFifths;

  return (
    <div className="min-h-screen bg-background bg-gradient-radial">
      {/* Header */}
      <div className="border-b border-border bg-gradient-secondary">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="relative">
                <Music className="w-8 h-8 text-primary animate-gentle-pulse" />
                <div className="absolute inset-0 animate-musical-float">
                  <Music className="w-8 h-8 text-primary-glow opacity-50" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-playfair font-bold musical-heading">
                Harmonic Geometry
              </h1>
            </div>
            <p className="text-xl musical-subheading max-w-2xl mx-auto">
              Explore the mathematical beauty hidden within music theory—where numbers become melodies and geometry creates harmony
            </p>
            <Badge variant="outline" className="border-primary text-primary bg-primary/10">
              Interactive Music Theory Visualizer
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <Button
                  key={view.id}
                  variant={activeView === view.id ? "default" : "outline"}
                  onClick={() => setActiveView(view.id)}
                  className={`
                    harmony-glow transition-bounce
                    ${activeView === view.id 
                      ? 'bg-gradient-primary shadow-glow border-primary' 
                      : 'border-border hover:border-primary hover:bg-primary/10'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  <div className="text-left">
                    <div className="font-semibold">{view.title}</div>
                    <div className="text-xs opacity-80">{view.subtitle}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Card className="shadow-elegant border-border bg-gradient-secondary">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-2">
                {views.find(view => view.id === activeView)?.title}
              </h2>
              <p className="text-muted-foreground musical-subheading">
                {views.find(view => view.id === activeView)?.subtitle}
              </p>
            </div>
            
            <div className="animate-fade-in">
              <ActiveComponent />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground musical-subheading">
              "Music is the pleasure the human mind experiences from counting without being aware that it is counting"
            </p>
            <p className="text-sm text-muted-foreground">— Gottfried Wilhelm Leibniz</p>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary">Interactive Visualizations</Badge>
              <Badge variant="secondary">Mathematical Beauty</Badge>
              <Badge variant="secondary">Musical Theory</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
