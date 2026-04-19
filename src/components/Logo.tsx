export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 47"
      fill="none"
      {...props}
    >
      <g clipPath="url(#logo)">
        <rect
          width="46.1"
          height="46.1"
          x="0.2"
          y="0.4"
          fill="#5b0c12"
          rx="12.5"
        ></rect>
        <path
          fill="#881337"
          fillRule="evenodd"
          d="M74 27.5 69.8 24a77.3 77.3 0 0 0-21.2-13.7c-8.4-3-16.9-2-25.3 0-8.5 2-17 5-25.4 5.6-8.4.5-16.9-1.6-21-2.6l-4.3-1v18.3H74v-3Z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#b91c1c"
          fillRule="evenodd"
          d="m-35 18.6 4.9 3c4.8 2.8 14.6 8.7 24.3 7.5s19.4-9.3 29-10.5c9.8-1.2 19.5 4.7 29.2 6.4a60 60 0 0 0 24.3-1.7l4.8-1.2v17.5H-35z"
          clipRule="evenodd"
        ></path>
        <path
          fill="#ef4444"
          fillRule="evenodd"
          d="m-9.8 33.9 3 1.5c3 1.4 9.1 4.3 15.2 3.2 6-1 12-6.2 18.1-8.3 6-2.2 12-1.5 18.1 1 6 2.6 12.1 7 15.2 9.1l3 2.2V47H-9.8z"
          clipRule="evenodd"
        ></path>
      </g>
      <text
        x="64"
        y="50%"
        dominantBaseline="middle"
        fill="#f4f4f5"
        fontFamily="Roboto Flex, Arial, Helvetica, sans-serif"
        fontSize="32"
        fontWeight="800"
        letterSpacing="0.6"
      >
        KeyRush
        <tspan fill="#ef4444">3D</tspan>
      </text>
      <defs>
        <clipPath id="logo">
          <rect
            width="46.1"
            height="46.1"
            x="0.2"
            y="0.4"
            fill="#5b0c12"
            rx="12.5"
          ></rect>
        </clipPath>
      </defs>
    </svg>
  );
}
