import {
  Baby,
  Armchair,
  Blocks,
  Flower2,
  Leaf,
  Mic2,
  Puzzle,
  Shirt,
  BatteryCharging,
  Bell,
  Clapperboard,
  Flag,
  Theater,
  Building,
  Camera,
  Car,
  CircleCheck,
  Coffee,
  Dog,
  Droplets,
  Dumbbell,
  Fence,
  Flame,
  Footprints,
  Gamepad2,
  Laptop,
  PartyPopper,
  PhoneCall,
  Presentation,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trees,
  Trophy,
  Umbrella,
  UserRound,
  Waves,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "Swimming Pool": Waves,
  "Private Pool": Waves,
  "Sea View": Umbrella,
  Clubhouse: Building,
  Gymnasium: Dumbbell,
  "Children's Play Area": Baby,
  "Landscaped Gardens": Trees,
  "Private Garden": Sprout,
  "24x7 Security": ShieldCheck,
  "Gated Community": Fence,
  "Power Backup": Zap,
  Lift: Building,
  "Covered Parking": Car,
  "Visitor Parking": Car,
  "Jogging Track": Footprints,
  "Indoor Games": Gamepad2,
  "Tennis Court": Trophy,
  "Badminton Court": Trophy,
  "Squash Court": Trophy,
  "Yoga Deck": Wind,
  "Rainwater Harvesting": Droplets,
  "Water Supply 24x7": Droplets,
  "EV Charging": BatteryCharging,
  CCTV: Camera,
  Intercom: PhoneCall,
  Spa: Sparkles,
  "Co-working Lounge": Laptop,
  "Party Hall": PartyPopper,
  "Senior Citizen Zone": UserRound,
  "Pet Park": Dog,
  "Gas Pipeline": Flame,
  Cafeteria: Coffee,
  "Conference Room": Presentation,
  "Fire Safety": Flame,
  Concierge: Bell,
  "Golf Course": Flag,
  "Pickleball & Padel Courts": Trophy,
  "Skating Rink": Footprints,
  "Mini Theatre": Clapperboard,
  Creche: Baby,
  Amphitheatre: Theater,
};

/** Keyword fallbacks so new or reworded amenities ("Indoor Gym + Yoga Lawn", "Kids Sandpit"…) still get a fitting icon. First match wins. */
const KEYWORDS: [RegExp, LucideIcon][] = [
  [/pool|swim/i, Waves],
  [/gym|fitness/i, Dumbbell],
  [/yoga|meditation|reflexology/i, Wind],
  [/ev\b|charging/i, BatteryCharging],
  [/parking/i, Car],
  [/toddler|sandpit|creche/i, Blocks],
  [/child|kid|play/i, Baby],
  [/elder|senior/i, UserRound],
  [/floral|herbal|flower/i, Flower2],
  [/waterfall|cascade|fountain|water/i, Droplets],
  [/garden|lawn|park|landscap/i, Trees],
  [/walk|jog|track|trail|pathway/i, Footprints],
  [/court|sport|tennis|badminton|squash|basket|dribble|cricket/i, Trophy],
  [/game|billiard|pool table|carrom/i, Gamepad2],
  [/stage|dance|music|amphi/i, Mic2],
  [/theatre|theater|cinema/i, Clapperboard],
  [/hall|party|banquet/i, PartyPopper],
  [/co-?work|work|business/i, Laptop],
  [/lounge|library|reading/i, Armchair],
  [/club/i, Building],
  [/security|guard/i, ShieldCheck],
  [/cctv|camera/i, Camera],
  [/power|backup|generator/i, Zap],
  [/lift|elevator/i, Building],
  [/spa|sauna|steam/i, Sparkles],
  [/cafe|café|coffee|restaurant/i, Coffee],
  [/pet|dog/i, Dog],
  [/laundry|wardrobe/i, Shirt],
  [/green|eco|organic/i, Leaf],
  [/activity|hobby/i, Puzzle],
];

export function amenityIcon(name: string): LucideIcon {
  return ICONS[name] ?? KEYWORDS.find(([re]) => re.test(name))?.[1] ?? CircleCheck;
}

export default function Amenities({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((a) => {
        const Icon = amenityIcon(a);
        return (
          <li key={a} className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-3 text-sm text-navy-800">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ivory text-gold-600">
              <Icon className="h-[18px] w-[18px]" />
            </span>
            {a}
          </li>
        );
      })}
    </ul>
  );
}
