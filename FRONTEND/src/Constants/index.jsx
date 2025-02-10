import { Cable } from "lucide-react";
import { Wrench } from "lucide-react";
import { Shirt } from "lucide-react";
import { Bike } from "lucide-react";


import user1 from "../assets/images/profile-pictures/User1.png"
import user2 from "../assets/images/profile-pictures/User2.png";
import user3 from "../assets/images/profile-pictures/User3.png";
import user4 from "../assets/images/profile-pictures/User4.png";
import user5 from "../assets/images/profile-pictures/User5.png";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];



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
      "Easily design and arrange your VR environments with a user-friendly drag-and-drop interface.",
  },
  {
    icon: <Wrench />,
    title: "Plumber",
    description:
      "Build VR applications that run seamlessly across multiple platforms, including mobile, desktop, and VR headsets.",
  },
  {
    icon: <Shirt />,
    title: "MamaFua",
    description:
      "Jumpstart your VR projects with a variety of built-in templates for different types of applications and environments.",
  },
  {
    icon: <Bike />,
    title: "PageBoy",
    description:
      "Preview your VR application in real-time as you make changes, allowing for quick iterations and adjustments.",
  }
];

export const checklistItems = [
  {
    title: "Code merge made easy",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Review code without worry",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "AI Assistance to reduce time",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
  {
    title: "Share work in minutes",
    description:
      "Track the performance of your VR apps and gain insights into user behavior.",
  },
];

export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];