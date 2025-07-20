import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Mode {
  name: string;
  greekName: string;
  startingDegree: number;
  character: string;
  mood: string;
  color: string;
}

export const ModeExplorer = () => {
  const [selectedKey, setSelectedKey] = useState<string>("C");
  const [selectedMode, setSelectedMode] = useState<string>("ionian");
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);

  const keys = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
  const chromaticNotes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

  const modes: Record<string, Mode> = {
    "ionian": { 
      name: "Ionian (Major)", 
      greekName: "Ionian", 
      startingDegree: 0, 
      character: "Happy, stable, resolved",
      mood: "Joyful & Bright",
      color: "#FFD700"
    },
    "dorian": { 
      name: "Dorian", 
      greekName: "Dorian", 
      startingDegree: 1, 
      character: "Sophisticated minor, jazzy",
      mood: "Contemplative",
      color: "#8A2BE2"
    },
    "phrygian": { 
      name: "Phrygian", 
      greekName: "Phrygian", 
      startingDegree: 2, 
      character: "Exotic, Spanish flavor",
      mood: "Mysterious & Dark",
      color: "#DC143C"
    },
    "lydian": { 
      name: "Lydian", 
      greekName: "Lydian", 
      startingDegree: 3, 
      character: "Dreamy, floating, ethereal",
      mood: "Mystical & Floating",
      color: "#00CED1"
    },
    "mixolydian": { 
      name: "Mixolydian", 
      greekName: "Mixolydian", 
      startingDegree: 4, 
      character: "Bluesy, rock, dominant",
      mood: "Confident & Groovy",
      color: "#FF8C00"
    },
    "aeolian": { 
      name: "Aeolian (Natural Minor)", 
      greekName: "Aeolian", 
      startingDegree: 5, 
      character: "Sad, melancholic, natural",
      mood: "Melancholic",
      color: "#4682B4"
    },
    "locrian": { 
      name: "Locrian", 
      greekName: "Locrian", 
      startingDegree: 6, 
      character: "Unstable, theoretical",
      mood: "Unsettling & Rare",
      color: "#8B0000"
    }
  };

  const majorScalePattern = [0, 2, 4, 5, 7, 9, 11]; // W-W-H-W-W-W-H

  const getScaleNotes = (rootKey: string, mode: string) => {
    const rootIndex = keys.findIndex(key => key.split('/')[0] === rootKey.split('/')[0]);
    const modeData = modes[mode];
    const scaleNotes = [];
    
    for (let i = 0; i < 7; i++) {
      const degree = (majorScalePattern[i] + modeData.startingDegree * 2) % 12;
      const noteIndex = (rootIndex + degree) % 12;
      scaleNotes.push(chromaticNotes[noteIndex]);
    }
    
    return scaleNotes;
  };

  const getAngle = (index: number) => (index * 30) - 90;

  const getPosition = (index: number, radius: number) => {
    const angle = getAngle(index) * (Math.PI / 180);
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    };
  };

  const currentMode = modes[selectedMode];
  const scaleNotes = getScaleNotes(selectedKey, selectedMode);
  const intervals = getIntervalPattern(selectedMode);

  function getIntervalPattern(mode: string): string[] {
    const patterns: Record<string, string[]> = {
      "ionian": ["W", "W", "H", "W", "W", "W", "H"],
      "dorian": ["W", "H", "W", "W", "W", "H", "W"],
      "phrygian": ["H", "W", "W", "W", "H", "W", "W"],
      "lydian": ["W", "W", "W", "H", "W", "W", "H"],
      "mixolydian": ["W", "W", "H", "W", "W", "H", "W"],
      "aeolian": ["W", "H", "W", "W", "H", "W", "W"],
      "locrian": ["H", "W", "W", "H", "W", "W", "W"]
    };
    return patterns[mode] || patterns["ionian"];
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Root Key:</label>
          <Select value={selectedKey} onValueChange={setSelectedKey}>
            <SelectTrigger className="w-32 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {keys.map((key) => (
                <SelectItem key={key} value={key.split('/')[0]}>
                  {key.split('/')[0]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Mode:</label>
          <Select value={selectedMode} onValueChange={setSelectedMode}>
            <SelectTrigger className="w-48 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(modes).map(([key, mode]) => (
                <SelectItem key={key} value={key}>
                  {mode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Modal Circle Visualization */}
        <Card className="shadow-musical bg-card-secondary border-border-accent">
          <CardContent className="p-8">
            <h3 className="text-xl font-playfair font-bold text-center mb-6 text-primary">
              {currentMode.name} in {selectedKey}
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

                {/* All chromatic notes (faded) */}
                {chromaticNotes.map((note, index) => {
                  const position = getPosition(index, 140);
                  const isInScale = scaleNotes.includes(note);
                  const isHighlighted = highlightedNote === note;
                  
                  return (
                    <g key={note}>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={isInScale ? "24" : "16"}
                        fill={isInScale ? currentMode.color : "hsl(var(--muted))"}
                        stroke="hsl(var(--border))"
                        strokeWidth={isHighlighted ? "3" : "2"}
                        className={isInScale ? "note-interactive animate-gentle-pulse" : ""}
                        style={{
                          opacity: isInScale ? 1 : 0.3,
                          filter: isHighlighted ? 'brightness(1.2)' : 'brightness(1)'
                        }}
                        onClick={() => setHighlightedNote(isHighlighted ? null : note)}
                      />
                      <text
                        x={position.x}
                        y={position.y + 4}
                        textAnchor="middle"
                        className="fill-background font-bold text-sm pointer-events-none"
                        style={{ fontSize: isInScale ? '12px' : '10px' }}
                      >
                        {note}
                      </text>
                      {isInScale && (
                        <text
                          x={position.x}
                          y={position.y - 35}
                          textAnchor="middle"
                          className="fill-primary font-bold text-xs pointer-events-none"
                        >
                          {scaleNotes.indexOf(note) + 1}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Scale connections */}
                {scaleNotes.map((note, index) => {
                  const noteIndex = chromaticNotes.indexOf(note);
                  const nextNote = scaleNotes[(index + 1) % scaleNotes.length];
                  const nextNoteIndex = chromaticNotes.indexOf(nextNote);
                  
                  const pos1 = getPosition(noteIndex, 140);
                  const pos2 = getPosition(nextNoteIndex, 140);
                  
                  return (
                    <line
                      key={`connection-${index}`}
                      x1={pos1.x}
                      y1={pos1.y}
                      x2={pos2.x}
                      y2={pos2.y}
                      stroke={currentMode.color}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Mode Information */}
        <div className="space-y-6">
          {/* Mode Details */}
          <Card className="shadow-elegant bg-gradient-secondary border-primary">
            <CardContent className="p-6">
              <h3 className="text-xl font-playfair font-bold mb-4 text-primary">
                {currentMode.greekName} Mode
              </h3>
              <div className="space-y-4">
                <div>
                  <Badge 
                    variant="outline" 
                    className="border-primary text-primary mb-2"
                    style={{ backgroundColor: `${currentMode.color}20` }}
                  >
                    {currentMode.mood}
                  </Badge>
                  <p className="text-muted-foreground musical-subheading">
                    {currentMode.character}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-accent">Scale Degrees:</h4>
                  <div className="flex flex-wrap gap-2">
                    {scaleNotes.map((note, index) => (
                      <Badge key={index} variant="secondary">
                        {index + 1}: {note}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interval Pattern */}
          <Card className="shadow-musical bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-playfair font-bold mb-4 text-primary">
                Interval Pattern
              </h3>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {intervals.map((interval, index) => (
                    <Badge 
                      key={index} 
                      variant={interval === "W" ? "default" : "outline"}
                      className={interval === "W" ? "bg-primary" : "border-accent text-accent"}
                    >
                      {interval === "W" ? "Whole" : "Half"}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  W = Whole step (2 semitones), H = Half step (1 semitone)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* All Modes Quick Reference */}
          <Card className="shadow-musical bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-playfair font-bold mb-4 text-primary">
                All Seven Modes
              </h3>
              <div className="space-y-2">
                {Object.entries(modes).map(([key, mode]) => (
                  <div 
                    key={key}
                    className={`flex items-center gap-3 p-2 rounded transition-smooth cursor-pointer ${
                      selectedMode === key ? 'bg-primary/20' : 'hover:bg-muted/20'
                    }`}
                    onClick={() => setSelectedMode(key)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: mode.color }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{mode.name}</div>
                      <div className="text-xs text-muted-foreground">{mode.mood}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Note */}
      <Card className="shadow-musical bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-playfair font-bold mb-4 text-primary">Understanding Modes</h3>
          <p className="text-muted-foreground">
            Modes are not separate scales—they're the same seven notes starting from different positions. 
            Each mode emphasizes a different tonal center, creating unique emotional colors and harmonic possibilities. 
            This is why the same chord progression can sound completely different depending on which mode guides the melody.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};