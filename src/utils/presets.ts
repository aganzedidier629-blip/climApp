export interface SkyPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  location: string;
  generateDataUrl: () => string;
}

export const SKY_PRESETS: SkyPreset[] = [
  {
    id: 'dry_sunny',
    name: 'Saison Sèche / Grand Soleil',
    icon: '☀️',
    description: 'Ciel bleu azur limpide et soleil de plomb sur un horizon sec.',
    location: 'Dakar, Sénégal',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw deep warm blue gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 300);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(0.6, '#38bdf8');
        grad.addColorStop(1, '#ffedd5'); // Warm dry desert ground horizon glow
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 300);

        // Draw bright sun glow
        const sunGrad = ctx.createRadialGradient(200, 100, 10, 200, 100, 90);
        sunGrad.addColorStop(0, '#ffffff');
        sunGrad.addColorStop(0.2, '#fef08a');
        sunGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.4)');
        sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(200, 100, 90, 0, Math.PI * 2);
        ctx.fill();

        // Draw dry silhouette mountains
        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.lineTo(80, 240);
        ctx.lineTo(160, 260);
        ctx.lineTo(260, 210);
        ctx.lineTo(340, 250);
        ctx.lineTo(400, 220);
        ctx.lineTo(400, 300);
        ctx.closePath();
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('SHIRIKANO PRESET: DRY & SUNNY', 15, 25);
      }
      return canvas.toDataURL('image/jpeg');
    }
  },
  {
    id: 'wet_stormy',
    name: 'Saison des Pluies / Mousson',
    icon: '⚡',
    description: 'Nuages bas violacés, rideau de pluie dense et éclairs.',
    location: 'Abidjan, Côte d\'Ivoire',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dark storm gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 300);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#311042');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 300);

        // Draw heavy clouds
        ctx.fillStyle = '#334155';
        for (let i = 0; i < 6; i++) {
          ctx.beginPath();
          ctx.arc(50 + i * 70, 80 + (i % 2) * 20, 60, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#1e293b';
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.arc(20 + i * 90, 50, 80, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw lightning bolt
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(250, 40);
        ctx.lineTo(210, 120);
        ctx.lineTo(240, 110);
        ctx.lineTo(190, 220);
        ctx.lineTo(210, 210);
        ctx.lineTo(170, 290);
        ctx.stroke();

        // Rain stripes
        ctx.strokeStyle = 'rgba(147, 197, 253, 0.15)';
        ctx.lineWidth = 1;
        for (let j = 0; j < 60; j++) {
          const rx = Math.random() * 400;
          const ry = Math.random() * 200 + 100;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 10, ry + 40);
          ctx.stroke();
        }

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('SHIRIKANO PRESET: WET & STORMY', 15, 25);
      }
      return canvas.toDataURL('image/jpeg');
    }
  },
  {
    id: 'temperate_autumn',
    name: 'Ciel Couvert d\'Automne',
    icon: '🍁',
    description: 'Ciel gris uniforme, feuilles mortes, douceur humide.',
    location: 'Paris, France',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dull grey/orange gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 300);
        grad.addColorStop(0, '#64748b');
        grad.addColorStop(0.7, '#94a3b8');
        grad.addColorStop(1, '#fed7aa'); // Warm glow from autumn leaves on ground
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 300);

        // Soft overcast sun
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.arc(100, 120, 40, 0, Math.PI * 2);
        ctx.fill();

        // Ground silhouettes (trees without leaves)
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.moveTo(0, 300);
        // Draw trunk 1
        ctx.lineTo(50, 300);
        ctx.lineTo(55, 210);
        ctx.lineTo(52, 210);
        ctx.lineTo(48, 300);
        // Draw trunk 2
        ctx.moveTo(300, 300);
        ctx.lineTo(315, 180);
        ctx.lineTo(320, 180);
        ctx.lineTo(305, 300);
        ctx.stroke();

        // Draw some orange blobs on trees for autumn leaves
        ctx.fillStyle = 'rgba(194, 65, 12, 0.7)';
        ctx.beginPath();
        ctx.arc(315, 160, 45, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(217, 119, 6, 0.7)';
        ctx.beginPath();
        ctx.arc(50, 195, 30, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('SHIRIKANO PRESET: OVERCAST AUTUMN', 15, 25);
      }
      return canvas.toDataURL('image/jpeg');
    }
  },
  {
    id: 'polar_winter',
    name: 'Neige & Blizzard d\'Hiver',
    icon: '❄️',
    description: 'Ciel blanc opalescent, blizzard et montagnes enneigées.',
    location: 'Chamonix, Alpes',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Ice-blue-white gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 300);
        grad.addColorStop(0, '#cbd5e1');
        grad.addColorStop(0.5, '#e2e8f0');
        grad.addColorStop(1, '#ffffff');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 300);

        // Snowy peak silhouettes
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(0, 300);
        ctx.lineTo(100, 110);
        ctx.lineTo(220, 220);
        ctx.lineTo(320, 90);
        ctx.lineTo(400, 190);
        ctx.lineTo(400, 300);
        ctx.closePath();
        ctx.fill();

        // Snow highlights on peaks
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(100, 110);
        ctx.lineTo(75, 160);
        ctx.lineTo(125, 160);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(320, 90);
        ctx.lineTo(290, 140);
        ctx.lineTo(340, 140);
        ctx.closePath();
        ctx.fill();

        // Draw snowflakes
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 80; i++) {
          ctx.beginPath();
          ctx.arc(Math.random() * 400, Math.random() * 300, Math.random() * 2.5 + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Label
        ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('SHIRIKANO PRESET: SNOWY WINTER', 15, 25);
      }
      return canvas.toDataURL('image/jpeg');
    }
  },
  {
    id: 'morning_fog',
    name: 'Brouillard Matinal',
    icon: '🌫️',
    description: 'Épaisse brume d\'automne occultant la ville.',
    location: 'Goma, RDC',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Deep misty gray/teal gradient
        const grad = ctx.createLinearGradient(0, 0, 0, 300);
        grad.addColorStop(0, '#475569');
        grad.addColorStop(0.5, '#64748b');
        grad.addColorStop(1, '#94a3b8');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 400, 300);

        // Draw faint building shapes in the background
        ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
        ctx.fillRect(40, 120, 60, 180);
        ctx.fillRect(140, 90, 80, 210);
        ctx.fillRect(260, 150, 70, 150);

        // Lay multiple semi-transparent foggy sheets over top
        ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.arc(50 + i * 110, 220 + (i % 2) * 20, 100, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(241, 245, 249, 0.5)';
        ctx.fillRect(0, 180, 400, 120);

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('SHIRIKANO PRESET: MORNING FOG', 15, 25);
      }
      return canvas.toDataURL('image/jpeg');
    }
  }
];
