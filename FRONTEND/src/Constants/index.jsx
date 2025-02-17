import { Cable, icons } from "lucide-react";
import { Wrench,Shirt,Bike,Facebook,Instagram,Twitter,MapPin,Mail,Phone } from "lucide-react";


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


]