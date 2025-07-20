import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Note {
  name: string;
  angle: number;
  index: number;
}

export const CircleOfFifths = () => {
  const [highlightedNote, setHighlightedNote] = useState<string | null>(null);
  const [showRelatedKeys, setShowRelatedKeys] = useState(false);

  // Circle of fifths progression
  const circleOfFifths = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯/G♭', 'C♯/D♭', 'G♯/A♭', 'D♯/E♭', 'A♯/B♭', 'F'];
  const chromatic = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];

  const getAngle = (index: number) => (index * 30) - 90; // 30 degrees per step, start at top

  const getCirclePosition = (index: number, radius: number) => {
    const angle = getAngle(index) * (Math.PI / 180);
    return {
      x: 200 + radius * Math.cos(angle),
      y: 200 + radius * Math.sin(angle)
    };
  };

  const getNoteColor = (note: string, index: number) => {
    const hue = index * 30; // Each note gets a different hue
    return `hsl(${hue}, 70%, 60%)`;
  };

  const getRelatedKeys = (note: string) => {
    const baseNote = note.split('/')[0];
    const index = circleOfFifths.indexOf(note);
    const related = [];
    
    // Add adjacent keys (dominant and subdominant)
    if (index > 0) related.push(circleOfFifths[index - 1]);
    if (index < circleOfFifths.length - 1) related.push(circleOfFifths[index + 1]);
    if (index === 0) related.push(circleOfFifths[circleOfFifths.length - 1]);
    if (index === circleOfFifths.length - 1) related.push(circleOfFifths[0]);
    
    return related;
  };

  return (
    <div className="space-y-8">
      {/* Interactive Controls */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          variant={showRelatedKeys ? "default" : "outline"}
          onClick={() => setShowRelatedKeys(!showRelatedKeys)}
          className="harmony-glow"
        >
          Show Key Relationships
        </Button>
        <Button
          variant="outline"
          onClick={() => setHighlightedNote(null)}
          className="harmony-glow"
        >
          Clear Selection
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Circle of Fifths */}
        <Card className="shadow-musical bg-card-secondary border-border-accent">
          <CardContent className="p-8">
            <h3 className="text-xl font-playfair font-bold text-center mb-6 text-primary">
              Circle of Fifths
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
                
                {/* Connection lines */}
                {circleOfFifths.map((note, index) => {
                  const nextIndex = (index + 1) % circleOfFifths.length;
                  const pos1 = getCirclePosition(index, 160);
                  const pos2 = getCirclePosition(nextIndex, 160);
                  
                  return (
                    <line
                      key={`line-${index}`}
                      x1={pos1.x}
                      y1={pos1.y}
                      x2={pos2.x}
                      y2={pos2.y}
                      stroke="hsl(var(--primary))"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  );
                })}

                {/* Note circles */}
                {circleOfFifths.map((note, index) => {
                  const position = getCirclePosition(index, 160);
                  const isHighlighted = highlightedNote === note;
                  const isRelated = showRelatedKeys && highlightedNote && 
                    getRelatedKeys(highlightedNote).includes(note);
                  
                  return (
                    <g key={note}>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={isHighlighted ? "28" : "24"}
                        fill={getNoteColor(note, index)}
                        stroke="hsl(var(--primary))"
                        strokeWidth={isHighlighted ? "3" : "2"}
                        className="note-interactive animate-gentle-pulse"
                        style={{
                          filter: isHighlighted || isRelated ? 'brightness(1.2)' : 'brightness(0.8)',
                          opacity: !highlightedNote || isHighlighted || isRelated ? 1 : 0.4
                        }}
                        onClick={() => setHighlightedNote(note)}
                      />
                      <text
                        x={position.x}
                        y={position.y + 5}
                        textAnchor="middle"
                        className="fill-background font-bold text-sm pointer-events-none"
                      >
                        {note.split('/')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Chromatic Circle */}
        <Card className="shadow-musical bg-card-secondary border-border-accent">
          <CardContent className="p-8">
            <h3 className="text-xl font-playfair font-bold text-center mb-6 text-primary">
              Chromatic Circle
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

                {/* Note circles */}
                {chromatic.map((note, index) => {
                  const position = getCirclePosition(index, 160);
                  const isInCircleOfFifths = circleOfFifths.includes(note);
                  
                  return (
                    <g key={note}>
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r="20"
                        fill={isInCircleOfFifths ? getNoteColor(note, circleOfFifths.indexOf(note)) : 'hsl(var(--muted))'}
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                        className="note-interactive"
                        style={{
                          opacity: isInCircleOfFifths ? 0.9 : 0.5
                        }}
                      />
                      <text
                        x={position.x}
                        y={position.y + 4}
                        textAnchor="middle"
                        className="fill-background font-bold text-xs pointer-events-none"
                      >
                        {note.split('/')[0]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Panel */}
      {highlightedNote && (
        <Card className="shadow-elegant bg-gradient-secondary border-primary">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-playfair font-bold text-primary">
                Key of {highlightedNote}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline" className="border-primary text-primary">
                  Major Key
                </Badge>
                {getRelatedKeys(highlightedNote).map(relatedKey => (
                  <Badge key={relatedKey} variant="secondary">
                    Related: {relatedKey}
                  </Badge>
                ))}
              </div>
              <p className="text-muted-foreground musical-subheading max-w-2xl mx-auto">
                Each step clockwise moves up a perfect fifth (7 semitones). 
                This creates the most harmonically related progression in music theory.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Educational Information */}
      <Card className="shadow-musical bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-playfair font-bold mb-4 text-primary">Understanding the Circle</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2 text-accent">Perfect Fifth Relationship</h4>
              <p className="text-muted-foreground">
                Each position represents a key that's a perfect fifth (7 semitones) above the previous one. 
                This creates the most fundamental harmonic relationship in Western music.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-accent">Key Signatures</h4>
              <p className="text-muted-foreground">
                Moving clockwise adds sharps, moving counter-clockwise adds flats. 
                This visualizes how key signatures are constructed mathematically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};