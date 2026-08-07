export const isGroup = (item) => item.children !== undefined

export const MAIN_NAV = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Founder's Message", href: "/founder-message" },
      { label: "Vision & Mission", href: "/vision-mission" },
      { label: "Objectives", href: "/objectives" },
      { label: "Management Team", href: "/team" },
      { label: "Awards & Recognition", href: "/awards" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    label: "Our Work",
    children: [
      { label: "Projects", href: "/projects" },
      { label: "Events", href: "/events" },
    ],
  },
  { label: "Crowdfunding", href: "/crowdfunding" },
  // { label: "News & Media", href: "/news" },
  { label: "Blog", href: "/news" },

  { label: "Gallery", href: "/gallery/photos" },
  {
    label: "Resources",
    children: [
      { label: "Annual Reports", href: "/reports/annual" },
      { label: "Audit Reports", href: "/reports/audit" },
      { label: "Downloads", href: "/downloads" },
    ],
  },
  { label: "Contact", href: "/contact" },
]

export const FOOTER_QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Our Projects", href: "/projects" },
  { label: "Events", href: "/events" },
  { label: "Register / Join Us", href: "/signup" },
  { label: "Contact", href: "/contact" },
]

export const FOOTER_RESOURCE_LINKS = [
  { label: "Annual Reports", href: "/reports/annual" },
  { label: "Audit Reports", href: "/reports/audit" },
  { label: "Downloads", href: "/downloads" },
  { label: "News & Media", href: "/news" },
  { label: "Awards", href: "/awards" },
  { label: "Testimonials", href: "/testimonials" },
]
