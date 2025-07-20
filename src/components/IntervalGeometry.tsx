import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Interval {
  name: string;
  semitones: number;
  ratio: string;
  character: string;
}

export const IntervalGeometry = () => {
  const [selectedInterval, setSelectedInterval] = useState<string>("perfect-fifth");
  const [showConnections, setShowConnections] = useState(true);

  const intervals: Record<string, Interval> = {
    "unison": { name: "Unison", semitones: 0, ratio: "1:1", character: "Identity" },
    "minor-second": { name: "Minor 2nd", semitones: 1, ratio: "16:15", character: "Dissonant tension" },
    "major-second": { name: "Major 2nd", semitones: 2, ratio: "9:8", character: "Gentle step" },
    "minor-third": { name: "Minor 3rd", semitones: 3, ratio: "6:5", character: "Melancholy sweetness" },
    "major-third": { name: "Major 3rd", semitones: 4, ratio: "5:4", character: "Bright joy" },
    "perfect-fourth": { name: "Perfect 4th", semitones: 5, ratio: "4:3", character: "Stable strength" },
    "tritone": { name: "Tritone", semitones: 6, ratio: "45:32", character: "Diabolic tension" },
    "perfect-fifth": { name: "Perfect 5th", semitones: 7, ratio: "3:2", character: "Perfect harmony" },
    "minor-sixth": { name: "Minor 6th", semitones: 8, ratio: "8:5", character: "Nostalgic longing" },
    "major-sixth": { name: "Major 6th", semitones: 9, ratio: "5:3", character: "Open brightness" },
    "minor-seventh": { name: "Minor 7th", semitones: 10, ratio: "16:9", character: "Bluesy resolution" },
    "major-seventh": { name: "Major 7th", semitones: 11, ratio: "15:8", character: "Leading tension" }
  };

  const notes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const currentInterval = intervals[selectedInterval];

  const getAngle = (index: number) => (index * 30) - 90; // 30 degrees per step, start at top

  const getPosition = (index: number, radius: number) => {
    const angle = getAngle(index) * (Math.PI / 180);
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    };
  };

  const getNoteColor = (index: number) => {
    const hue = index * 30;
    return `hsl(${hue}, 70%, 60%)`;
  };

  const getGeometricPattern = (semitones: number) => {
    if (semitones === 0) return { sides: 1, symmetry: 12, description: "Point (no movement)" };
    
    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    const commonDivisor = gcd(12, semitones);
    const sides = 12 / commonDivisor;
    const symmetry = commonDivisor;
    
    const shapeNames: Record<number, string> = {
      1: "Circle",
      2: "Line (diameter)",
      3: "Triangle",
      4: "Square", 
      6: "Hexagon",
      12: "Dodecagon"
    };
    
    return {
      sides,
      symmetry,
      description: shapeNames[sides] || `${sides}-sided polygon`
    };
  };

  const pattern = getGeometricPattern(currentInterval.semitones);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Select Interval:</label>
          <Select value={selectedInterval} onValueChange={setSelectedInterval}>
            <SelectTrigger className="w-48 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(intervals).map(([key, interval]) => (
                <SelectItem key={key} value={key}>
                  {interval.name} ({interval.semitones} semitones)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant={showConnections ? "default" : "outline"}
          onClick={() => setShowConnections(!showConnections)}
          className="harmony-glow"
        >
          {showConnections ? "Hide" : "Show"} Connections
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Geometric Visualization */}
        <Card className="shadow-musical bg-card-secondary border-border-accent">
          <CardContent className="p-8">
            <h3 className="text-xl font-playfair font-bold text-center mb-6 text-primary">
              {currentInterval.name} Pattern
            </h3>
            <div className="relative w-96 h-96 mx-auto">
              <svg width="400" height="400" className="absolute inset-0">
                {/* Background circle */}
                <circle
                  cx="200"
                  cy="200"
                  r="160"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  opacity="0.3"
                />
                
                {/* Hour markers like a clock */}
                {Array.from({ length: 12 }, (_, i) => {
                  const position = getPosition(i, 170);
                  return (
                    <line
                      key={`marker-${i}`}
                      x1={position.x}
                      y1={position.y}
                      x2={getPosition(i, 150).x}
                      y2={getPosition(i, 150).y}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  );
                })}

                {/* Interval connections */}
                {showConnections && currentInterval.semitones > 0 && notes.map((_, index) => {
                  const startPos = getPosition(index, 140);
                  const endIndex = (index + currentInterval.semitones) % 12;
                  const endPos = getPosition(endIndex, 140);
                  
                  return (
                    <line
                      key={`connection-${index}`}
                      x1={startPos.x}
                      y1={startPos.y}
                      x2={endPos.x}
                      y2={endPos.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      opacity="0.7"
                      className="animate-gentle-pulse"
                    />
                  );
                })}

                {/* Note circles */}
                {notes.map((note, index) => {
                  const position = getPosition(index, 140);
                  
                  return (
                    <g key={note}>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="20"
                        fill={getNoteColor(index)}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        className="note-interactive"
                      />
                      <text
                        x={position.x}
                        y={position.y + 5}
                        textAnchor="middle"
                        className="fill-background font-bold text-sm pointer-events-none"
                      >
                        {note}
                      </text>
                    </g>
                  );
                })}

                {/* Center info */}
                <text
                  x="200"
                  y="200"
                  textAnchor="middle"
                  className="fill-primary font-bold text-lg"
                >
                  {currentInterval.semitones}
                </text>
                <text
                  x="200"
                  y="218"
                  textAnchor="middle"
                  className="fill-muted-foreground text-sm"
                >
                  semitones
                </text>
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* Interval Information */}
          <Card className="shadow-elegant bg-gradient-secondary border-primary">
            <CardContent className="p-6">
              <h3 className="text-xl font-playfair font-bold mb-4 text-primary">
                {currentInterval.name}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Semitones:</span>
                  <Badge variant="outline" className="border-primary text-primary">
                    {currentInterval.semitones}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Frequency Ratio:</span>
                  <Badge variant="secondary">
                    {currentInterval.ratio}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Character:</span>
                  <span className="text-accent musical-subheading">{currentInterval.character}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Geometric Analysis */}
          <Card className="shadow-musical bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-playfair font-bold mb-4 text-primary">
                Geometric Pattern
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Creates:</span>
                  <Badge variant="outline" className="border-accent text-accent">
                    {pattern.description}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Symmetry:</span>
                  <Badge variant="secondary">
                    {pattern.symmetry}-fold
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  {currentInterval.semitones === 0 && "The unison creates no geometric pattern—all notes remain in place."}
                  {currentInterval.semitones === 1 && "Minor seconds create a 12-pointed star, touching every chromatic note."}
                  {currentInterval.semitones === 2 && "Major seconds create a hexagon, dividing the octave into 6 whole tones."}
                  {currentInterval.semitones === 3 && "Minor thirds create a square, forming four diminished triads."}
                  {currentInterval.semitones === 4 && "Major thirds create a triangle, forming three augmented triads."}
                  {currentInterval.semitones === 5 && "Perfect fourths create a 12-pointed star pattern."}
                  {currentInterval.semitones === 6 && "The tritone creates a line, dividing the octave exactly in half."}
                  {currentInterval.semitones === 7 && "Perfect fifths create the most important pattern—the circle of fifths!"}
                  {currentInterval.semitones > 7 && "This interval creates the same pattern as its inversion."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mathematical Insight */}
          <Card className="shadow-musical bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-playfair font-bold mb-4 text-primary">
                Mathematical Beauty
              </h3>
              <p className="text-sm text-muted-foreground">
                The geometric patterns emerge from the greatest common divisor (GCD) of 12 and the interval size. 
                Simple ratios create simple geometric shapes, which is why they sound consonant to our ears. 
                Complex ratios create complex patterns and sound dissonant.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};