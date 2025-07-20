import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, RotateCcw } from "lucide-react";

interface Chord {
  numeral: string;
  root: string;
  quality: string;
  notes: string[];
  function: string;
  color: string;
}

interface Progression {
  name: string;
  numerals: string[];
  description: string;
  examples: string[];
}

export const ChordProgressionAnalyzer = () => {
  const [selectedKey, setSelectedKey] = useState<string>("C");
  const [selectedProgression, setSelectedProgression] = useState<string>("vi-IV-I-V");
  const [playingChord, setPlayingChord] = useState<number | null>(null);

  const keys = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
  const chromaticNotes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];

  const progressions: Record<string, Progression> = {
    "I-V-vi-IV": {
      name: "I-V-vi-IV (Pop Progression)",
      numerals: ["I", "V", "vi", "IV"],
      description: "The most popular progression in modern music",
      examples: ["Let It Be", "Don't Stop Believin'", "Someone Like You"]
    },
    "vi-IV-I-V": {
      name: "vi-IV-I-V (Pop Variations)",
      numerals: ["vi", "IV", "I", "V"],
      description: "Emotional variant starting on the relative minor",
      examples: ["Zombie", "Complicated", "What's Up?"]
    },
    "I-vi-IV-V": {
      name: "I-vi-IV-V (50s Progression)",
      numerals: ["I", "vi", "IV", "V"],
      description: "Classic doo-wop and early rock progression",
      examples: ["Stand By Me", "Blue Moon", "Heart and Soul"]
    },
    "ii-V-I": {
      name: "ii-V-I (Jazz Standard)",
      numerals: ["ii", "V", "I"],
      description: "The fundamental unit of jazz harmony",
      examples: ["All The Things You Are", "Autumn Leaves", "Fly Me to the Moon"]
    },
    "I-IV-V": {
      name: "I-IV-V (Blues/Rock)",
      numerals: ["I", "IV", "V"],
      description: "The foundation of blues and rock music",
      examples: ["Wild Thing", "Louie Louie", "Twist and Shout"]
    },
    "vi-ii-V-I": {
      name: "vi-ii-V-I (Circle of Fifths)",
      numerals: ["vi", "ii", "V", "I"],
      description: "Complete circle of fifths progression",
      examples: ["Fly Me to the Moon", "All of Me", "Georgia On My Mind"]
    }
  };

  const romanNumeralMap: Record<string, { degree: number; quality: string; function: string; color: string }> = {
    "I": { degree: 0, quality: "Major", function: "Tonic (Home)", color: "#FFD700" },
    "ii": { degree: 1, quality: "Minor", function: "Subdominant", color: "#98FB98" },
    "iii": { degree: 2, quality: "Minor", function: "Mediant", color: "#87CEEB" },
    "IV": { degree: 3, quality: "Major", function: "Subdominant", color: "#DDA0DD" },
    "V": { degree: 4, quality: "Major", function: "Dominant", color: "#F0E68C" },
    "vi": { degree: 5, quality: "Minor", function: "Relative Minor", color: "#FFB6C1" },
    "vii°": { degree: 6, quality: "Diminished", function: "Leading Tone", color: "#FFA07A" }
  };

  const majorScaleNotes = [0, 2, 4, 5, 7, 9, 11]; // Semitone intervals for major scale

  const getKeyIndex = (key: string) => {
    return chromaticNotes.findIndex(note => note === key.split('/')[0]);
  };

  const getScaleNotes = (key: string) => {
    const keyIndex = getKeyIndex(key);
    return majorScaleNotes.map(interval => chromaticNotes[(keyIndex + interval) % 12]);
  };

  const buildChord = (root: string, quality: string): string[] => {
    const rootIndex = chromaticNotes.indexOf(root);
    
    switch (quality) {
      case "Major":
        return [
          chromaticNotes[rootIndex],
          chromaticNotes[(rootIndex + 4) % 12], // Major third
          chromaticNotes[(rootIndex + 7) % 12]  // Perfect fifth
        ];
      case "Minor":
        return [
          chromaticNotes[rootIndex],
          chromaticNotes[(rootIndex + 3) % 12], // Minor third
          chromaticNotes[(rootIndex + 7) % 12]  // Perfect fifth
        ];
      case "Diminished":
        return [
          chromaticNotes[rootIndex],
          chromaticNotes[(rootIndex + 3) % 12], // Minor third
          chromaticNotes[(rootIndex + 6) % 12]  // Diminished fifth
        ];
      default:
        return [chromaticNotes[rootIndex]];
    }
  };

  const analyzeProgression = (key: string, numerals: string[]): Chord[] => {
    const scaleNotes = getScaleNotes(key);
    
    return numerals.map(numeral => {
      const chordInfo = romanNumeralMap[numeral];
      const root = scaleNotes[chordInfo.degree];
      const notes = buildChord(root, chordInfo.quality);
      
      return {
        numeral,
        root,
        quality: chordInfo.quality,
        notes,
        function: chordInfo.function,
        color: chordInfo.color
      };
    });
  };

  const currentProgression = progressions[selectedProgression];
  const chords = analyzeProgression(selectedKey, currentProgression.numerals);

  const simulatePlayback = (chordIndex: number) => {
    setPlayingChord(chordIndex);
    setTimeout(() => setPlayingChord(null), 1000);
  };

  const getAngle = (index: number) => (index * 30) - 90;

  const getPosition = (index: number, radius: number) => {
    const angle = getAngle(index) * (Math.PI / 180);
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    };
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Key:</label>
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
          <label className="text-sm font-medium text-foreground">Progression:</label>
          <Select value={selectedProgression} onValueChange={setSelectedProgression}>
            <SelectTrigger className="w-64 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(progressions).map(([key, prog]) => (
                <SelectItem key={key} value={key}>
                  {prog.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Chord Progression Visualization */}
        <Card className="shadow-musical bg-card-secondary border-border-accent">
          <CardContent className="p-8">
            <h3 className="text-xl font-playfair font-bold text-center mb-6 text-primary">
              {currentProgression.name} in {selectedKey}
            </h3>
            
            {/* Playback Controls */}
            <div className="flex justify-center gap-2 mb-6">
              <Button
                onClick={() => {
                  chords.forEach((_, index) => {
                    setTimeout(() => simulatePlayback(index), index * 1200);
                  });
                }}
                className="harmony-glow"
              >
                <Play className="w-4 h-4 mr-2" />
                Play Progression
              </Button>
              <Button
                variant="outline"
                onClick={() => setPlayingChord(null)}
                className="harmony-glow"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Chord Sequence */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {chords.map((chord, index) => (
                <Card
                  key={index}
                  className={`
                    p-4 text-center cursor-pointer transition-bounce border-2
                    ${playingChord === index 
                      ? 'border-primary shadow-glow transform scale-105' 
                      : 'border-border hover:border-primary'
                    }
                  `}
                  style={{ 
                    backgroundColor: playingChord === index ? `${chord.color}20` : 'transparent'
                  }}
                  onClick={() => simulatePlayback(index)}
                >
                  <div className="font-bold text-lg text-primary">{chord.numeral}</div>
                  <div className="text-sm text-muted-foreground">{chord.root} {chord.quality}</div>
                  <div className="text-xs text-accent mt-1">{chord.function}</div>
                </Card>
              ))}
            </div>

            {/* Circle Visualization */}
            <div className="relative w-80 h-80 mx-auto">
              <svg width="320" height="320" className="absolute inset-0">
                {/* Background circle */}
                <circle
                  cx="160"
                  cy="160"
                  r="120"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  opacity="0.3"
                />

                {/* Scale notes */}
                {getScaleNotes(selectedKey).map((note, index) => {
                  const position = getPosition(index * (12/7), 120); // Spread 7 notes around circle
                  const chordUsingThisNote = chords.find(chord => chord.root === note);
                  const isPlaying = chordUsingThisNote && playingChord === chords.indexOf(chordUsingThisNote);
                  
                  return (
                    <g key={note}>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={isPlaying ? "20" : "16"}
                        fill={chordUsingThisNote ? chordUsingThisNote.color : "hsl(var(--muted))"}
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                        className={chordUsingThisNote ? "note-interactive" : ""}
                        style={{
                          filter: isPlaying ? 'brightness(1.3)' : 'brightness(1)',
                          opacity: chordUsingThisNote ? 1 : 0.5
                        }}
                      />
                      <text
                        x={position.x}
                        y={position.y + 4}
                        textAnchor="middle"
                        className="fill-background font-bold text-sm pointer-events-none"
                      >
                        {note}
                      </text>
                      {chordUsingThisNote && (
                        <text
                          x={position.x}
                          y={position.y - 25}
                          textAnchor="middle"
                          className="fill-primary font-bold text-xs pointer-events-none"
                        >
                          {chordUsingThisNote.numeral}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* Progression Info */}
          <Card className="shadow-elegant bg-gradient-secondary border-primary">
            <CardContent className="p-6">
              <h3 className="text-xl font-playfair font-bold mb-4 text-primary">
                Harmonic Analysis
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground musical-subheading">
                  {currentProgression.description}
                </p>
                <div>
                  <h4 className="font-semibold mb-2 text-accent">Famous Examples:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentProgression.examples.map((example, index) => (
                      <Badge key={index} variant="secondary">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chord Details */}
          <Card className="shadow-musical bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-playfair font-bold mb-4 text-primary">
                Chord Analysis
              </h3>
              <div className="space-y-3">
                {chords.map((chord, index) => (
                  <div 
                    key={index}
                    className={`
                      p-3 rounded border transition-smooth
                      ${playingChord === index 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: chord.color }}
                      />
                      <div className="flex-1">
                        <div className="font-semibold">
                          {chord.numeral}: {chord.root} {chord.quality}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Notes: {chord.notes.join(' - ')}
                        </div>
                        <div className="text-xs text-accent">
                          Function: {chord.function}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Function Analysis */}
          <Card className="shadow-musical bg-card border-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-playfair font-bold mb-4 text-primary">
                Harmonic Function
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500 mb-2">
                    Tonic (I, vi)
                  </Badge>
                  <p className="text-muted-foreground">Home, rest, stability</p>
                </div>
                <div>
                  <Badge variant="outline" className="border-purple-500 text-purple-500 mb-2">
                    Subdominant (IV, ii)
                  </Badge>
                  <p className="text-muted-foreground">Departure from home, preparation</p>
                </div>
                <div>
                  <Badge variant="outline" className="border-blue-500 text-blue-500 mb-2">
                    Dominant (V, vii°)
                  </Badge>
                  <p className="text-muted-foreground">Tension, wants to resolve to tonic</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Note */}
      <Card className="shadow-musical bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-playfair font-bold mb-4 text-primary">The Magic of Chord Progressions</h3>
          <p className="text-muted-foreground">
            Chord progressions work because they create patterns of tension and resolution that our ears find satisfying. 
            The circle of fifths relationship (moving by perfect fifths) creates the strongest harmonic movement, 
            which is why progressions like ii-V-I feel so natural and complete. Each chord has a harmonic function—
            tonic (home), subdominant (departure), or dominant (tension)—and these functions create the emotional 
            narrative of music.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};