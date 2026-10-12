import React from 'react';
import {
  Globe,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Mail,
  Send,
  Music,
  Video,
  Rocket,
  Briefcase,
  Coffee,
  Calendar,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  ShoppingBag,
  Heart,
  Compass,
  Code,
  Share2,
  DollarSign,
  MessageSquare,
} from 'lucide-react';

interface IconRendererProps {
  name?: string;
  className?: string;
}

export const AVAILABLE_ICONS = [
  { id: 'globe', label: 'Website / Globe', icon: Globe },
  { id: 'rocket', label: 'Rocket / Launch', icon: Rocket },
  { id: 'briefcase', label: 'Portfolio / Work', icon: Briefcase },
  { id: 'code', label: 'Code / Dev', icon: Code },
  { id: 'github', label: 'GitHub', icon: Github },
  { id: 'twitter', label: 'Twitter / X', icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'instagram', label: 'Instagram', icon: Instagram },
  { id: 'mail', label: 'Email / Newsletter', icon: Mail },
  { id: 'coffee', label: 'Buy Me a Coffee', icon: Coffee },
  { id: 'calendar', label: 'Calendar / Book Call', icon: Calendar },
  { id: 'music', label: 'Music / Audio', icon: Music },
  { id: 'video', label: 'Video / Stream', icon: Video },
  { id: 'sparkles', label: 'Featured / Special', icon: Sparkles },
  { id: 'shopping-bag', label: 'Store / Shop', icon: ShoppingBag },
  { id: 'book-open', label: 'Blog / Article', icon: BookOpen },
  { id: 'heart', label: 'Support / Donate', icon: Heart },
  { id: 'compass', label: 'Explore / Map', icon: Compass },
  { id: 'dollar-sign', label: 'Pricing / Sponsor', icon: DollarSign },
  { id: 'message-square', label: 'Chat / Discord', icon: MessageSquare },
  { id: 'link', label: 'Generic Link', icon: LinkIcon },
];

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5' }) => {
  const iconKey = (name || '').toLowerCase().trim();

  switch (iconKey) {
    case 'rocket':
      return <Rocket className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'github':
      return <Github className={className} />;
    case 'twitter':
    case 'x':
      return <Twitter className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'mail':
    case 'email':
      return <Mail className={className} />;
    case 'telegram':
    case 'send':
      return <Send className={className} />;
    case 'music':
    case 'spotify':
      return <Music className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'coffee':
      return <Coffee className={className} />;
    case 'calendar':
      return <Calendar className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'code':
      return <Code className={className} />;
    case 'book-open':
    case 'blog':
      return <BookOpen className={className} />;
    case 'shopping-bag':
    case 'store':
      return <ShoppingBag className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'compass':
      return <Compass className={className} />;
    case 'share':
      return <Share2 className={className} />;
    case 'dollar-sign':
      return <DollarSign className={className} />;
    case 'message-square':
    case 'discord':
      return <MessageSquare className={className} />;
    case 'globe':
    default:
      return <Globe className={className} />;
  }
};
