import { Cable, icons } from "lucide-react";
import { Wrench,Shirt,Bike,Facebook,Instagram,Twitter,MapPin,Mail,Phone,FolderKanban,Wallet,Calendar } from "lucide-react";


import user1 from "../assets/images/profile-pictures/User1.png"
import user2 from "../assets/images/profile-pictures/User2.png";
import user3 from "../assets/images/profile-pictures/User3.png";
import user4 from "../assets/images/profile-pictures/User4.png";
import user5 from "../assets/images/profile-pictures/User5.png";





export const steps = [
    { number: "1", title: "Login", description: "Log in to your account. If you don’t have an account, create an account." },
    { number: "2", title: "Browse Services", description: "Browse through our wide scope of services and service providers." },
    { number: "3", title: "Request Service", description: "Click on a service and select your desired service provider." },
    { number: "4", title: "Payment of Service", description: "Upon completion of work, you’ll verify the quality of work and complete payment." }
  ];


export const testimonials = [
  {
    user: "John Doe",
    location: "Nairobi, Kenya",
    image: user1,
    text: "I am extremely satisfied with the services provided. The team was responsive, professional, and delivered results beyond my expectations.",
    rating:"3",
  },
  {
    user: "Jane Smith",
    location: "Nairobi, Kenya",
    image: user5,
    text: "I couldn't be happier with the outcome of our project. The team's creativity and problem-solving skills were instrumental in bringing our vision to life",
    rating:"4",
  },
  {
    user: "David Johnson",
    location: "Nairobi, Kenya",
    image: user3,
    text: "Working with this company was a pleasure. Their attention to detail and commitment to excellence are commendable. I would highly recommend them to anyone looking for top-notch service.",
    rating:"5",
  },
];

export const services = [
  {
    icon: <Cable/>,
    title: "Electrician",
    description:
      "All Electrical services such as repairs, installations and maintenance.",
  },
  {
    icon: <Wrench />,
    title: "Plumber",
    description:
      "All Electrical services such as repairs, installations and maintenance.",
  },
  {
    icon: <Shirt />,
    title: "MamaFua",
    description:
      "All Electrical services such as repairs, installations and maintenance.",
  },
  {
    icon: <Bike />,
    title: "PageBoy",
    description:
      "All Electrical services such as repairs, installations and maintenance.",
  }
];



export const GetInTouch = [
  { icon: <MapPin size={18}/>, text: "Magadi Road" },
  { icon: <Mail size={18}/>, text: "HudumaMtaani.co.ke" },
  { icon: <Phone size={18}/>, text: "+254-712345678" },
];

export const QuickLinks = [
  { href: "#", text: "Platform" },
  { href: "#", text: "Plans & Pricing" },
  { href: "#", text: "Become a Service Provider" },
];


export const socials = [
  {icon: <Facebook size={18}/> },
  {icon: <Instagram size={18}/>},
  {icon: <Twitter size={18}/>},
];

export const Auth = [
  {icon:<Facebook/>,text: "Google"},
  {icon:<Facebook/>,text: "Apple"},
  {icon:<Facebook/>,text:"Facebook"}
];

export const DashServices = [
  {icon:<Wrench/>,text: "Plumbing"},
  {icon:<Cable/>,text: "Electrician"},
  {icon:<Shirt/>,text: "Laundry"},
  {icon:<Bike/>,text: "Errands"},

];
export const ServiceProviderDashServices = [
  {icon:<Wrench/>,text: "All Orders"},
  {icon:<Cable/>,text: "Pending Orders"},
  {icon:<Shirt/>,text: "Completed Orders"},
  {icon:<Bike/>,text: "Payments"},

];

export const AdminDashServices = [
  {icon:<Wrench/>,text: "Add Service"},
  {icon:<Cable/>,text: "View Services"},

];
export const AdminDashServiceProviders = [
  {icon:<Wrench/>,text: "Add Service Provider"},
  {icon:<Cable/>,text: "View Service Providers"},

];

export const DashHistory = [
  {icon:<FolderKanban/>,text: "Services"},
  {icon:<Wallet/>,text: "Payment"},
];


export const serviceProvidersData = {
  'Plumbing': [
    { id: 1, name: 'John Doe', rating: 4.8, reviews: 124, location: 'Westlands, Nairobi', phone: '+254712345678', availability: 'Available Today',image:user1 },
    { id: 2, name: 'Jane Doe', rating: 4.5, reviews: 98, location: 'Kilimani, Nairobi', phone: '+254723456789', availability: 'Available Tomorrow',image:user3 },
    { id: 3, name: 'John Smith', rating: 4.7, reviews: 112, location: 'South C, Nairobi', phone: '+254734567890', availability: 'Available Today',image:user4 }
  ],
  'Electrician': [
    { id: 1, name: 'Power Solutions', rating: 4.9, reviews: 156, location: 'South B, Nairobi', phone: '+254745678901', availability: 'Available Today',image:user1 },
    { id: 2, name: 'Electro Experts', rating: 4.7, reviews: 112, location: 'Langata, Nairobi', phone: '+254756789012', availability: 'Available in 2 Days',image:user3 },
    { id: 3, name: 'Bright Sparks', rating: 4.6, reviews: 87, location: 'Donholm, Nairobi', phone: '+254767890123', availability: 'Available Tomorrow',image:user5 }
  ],
  'Laundry': [
    { id: 1, name: 'Clean & Fresh Laundry', rating: 4.6, reviews: 89, location: 'CBD, Nairobi', phone: '+254778901234', availability: 'Available Today',image:user1 },
    { id: 2, name: 'Express Wash', rating: 4.4, reviews: 76, location: 'Parklands, Nairobi', phone: '+254789012345', availability: 'Available Tomorrow',image:user3 },
    { id: 3, name: 'Spotless Services', rating: 4.7, reviews: 102, location: 'Kileleshwa, Nairobi', phone: '+254790123456', availability: 'Available Today',image:user4 }
  ],
  'Errands': [
    { id: 1, name: 'Run4You Errands', rating: 4.7, reviews: 102, location: 'Karen, Nairobi', phone: '+254701234567', availability: 'Available Today',image:user2 },
    { id: 2, name: 'Swift Runners', rating: 4.5, reviews: 84, location: 'Kileleshwa, Nairobi', phone: '+254712345678', availability: 'Available Today',image:user4 },
    { id: 3, name: 'Errand Experts', rating: 4.6, reviews: 93, location: 'Lavington, Nairobi', phone: '+254723456789', availability: 'Available Tomorrow',image:user5 }
  ]
};

export const AdminInisghts = [
  {
    Quantity: "450",
    Text: "Total Orders",
    Icon: <Calendar/>
  },
  {
    Quantity: "3",
    Text: "Pending Orders",
    Icon: <Calendar/>
  }, 
  {
    Quantity: "Ksh 10K",
    Text: "Total Revenue",
    Icon: <Calendar/>
  },
  {
    Quantity: "450",
    Text: "Customers",
    Icon: <Calendar/>
  },
  {
    Quantity: "3",
    Text: "Service Providers",
    Icon: <Calendar/>
  },
  {
    Quantity: "Ksh 8K",
    Text: "Total Earnings",
    Icon: <Calendar/>
  },
]

export const ProviderInsights = [
  {
    Quantity: "450",
    Text: "Total Orders",
    Icon: <Calendar/>
  },
  {
    Quantity: "3",
    Text: "Pending Orders",
    Icon: <Calendar/>
  }, 
  {
    Quantity: "Ksh 10K",
    Text: "Total Revenue",
    Icon: <Calendar/>
  }
]

//import images
import cleanerImage from '../assets/images/cleaner_2.jpeg';
import plumpImage from '../assets/images/plumber.jpeg';
import electImage from '../assets/images/stima.jpeg';
import paintImage from '../assets/images/elctr.jpg';
import gardenImage from '../assets/images/elctr1.jpeg';
import cleanImage from '../assets/images/fua.jpg';
import electricianImage from '../assets/images/elctr2.jpeg';
import fuaImage from '../assets/images/Mama_Fua_3_big.jpg';
import houseImage from '../assets/images/cleaner.jpeg';

// Mock notifications data
export  const notifications = [
  {
    id: 1,
    type: 'booking',
    message: 'Your cleaning service has been confirmed',
    time: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'reminder',
    message: 'Upcoming plumbing service tomorrow at 2 PM',
    time: '1 hour ago',
    read: false
  },
  {
    id: 3,
    type: 'review',
    message: 'Please rate your recent electrical service',
    time: '2 hours ago',
    read: true
  }
];

// Mock user data
export const userData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
};


export const upcomingBookings = [
  { id: 1,
    service: 'Cleaning',
    provider: 'Jane Doe',
    date: '2024-03-20',
    time: '09:00 AM',
    status: 'confirmed'
  },
  {
    id: 2,
    service: 'Plumbing',
    provider: 'John Smith',
    date: '2024-03-22',
    time: '02:00 PM',
    status: 'pending'
  }
];

// Updated serviceProviders array with 9 services
export const serviceProviders = [
  {
    id: 1,
    name: 'Jane Doe',
    service: 'Cleaning',
    rating: 4.8,
    price: '1000-2000',
    image: cleanerImage
  },
  {
    id: 2,
    name: 'John Smith',
    service: 'Plumbing',
    rating: 4.5,
    price: '1500-3000',
    image: plumpImage
  },
  {
    id: 3,
    name: 'Alice Johnson',
    service: 'Electrical',
    rating: 4.7,
    price: '2000-4000',
    image: electImage
  },
  {
    id: 4,
    name: 'Bob Brown',
    service: 'Appliance Repair',
    rating: 4.6,
    price: '2500-5000',
    image: paintImage
  },
  {
    id: 5,
    name: 'Charlie Davis',
    service: 'Mama fua',
    rating: 4.4,
    price: '3000-6000',
    image: cleanImage
  },
  {
    id: 6,
    name: 'Eve White',
    service: 'Electrical',
    rating: 4.9,
    price: '1000-2500',
    image: gardenImage
  },
  {
    id: 7,
    name: 'Frank Wilson',
    service: 'Electrical',
    rating: 4.3,
    price: '2000-4500',
    image: electricianImage
  },
  {
    id: 8,
    name: 'Grace Lee',
    service: 'Mama Fua',
    rating: 4.7,
    price: '1500-3500',
    image: fuaImage
  },
  {
    id: 9,
    name: 'Henry Moore',
    service: 'Carpet Cleaning',
    rating: 4.5,
    price: '5000-10000',
    image: houseImage
  }
];

export const analyticsData = {
  serviceUsage: [
    { service: 'Cleaning', count: 45, percentage: 45 },
    { service: 'Plumbing', count: 30, percentage: 30 },
    { service: 'Electrical', count: 15, percentage: 15 },
    { service: 'Painting', count: 10, percentage: 10 }
  ],
  monthlyBookings: [
    { month: 'Jan', count: 20 },
    { month: 'Feb', count: 25 },
    { month: 'Mar', count: 35 },
    { month: 'Apr', count: 30 },
    { month: 'May', count: 40 },
    { month: 'Jun', count: 45 }
  ],
  ratingDistribution: [
    { stars: 5, count: 150 },
    { stars: 4, count: 100 },
    { stars: 3, count: 30 },
    { stars: 2, count: 15 },
    { stars: 1, count: 5 }
  ],
  stats: {
    totalBookings: 300,
    completedServices: 285,
    averageRating: 4.5,
    totalSpent: 45000
  }
};
