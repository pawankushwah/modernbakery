import { ReactNode } from "react";

interface FormCardProps {
  title: string;
  children: ReactNode;
}

export default function FormCard({ title, children }: FormCardProps) {
  return (
    <section className=" bg-[#FFFFFF] shadow-sm  opacity-100 rounded-[10px] border border-gray-300 p-[20px] gap-[25px] left-">
      <h2 className=" font-semibold text-[20px] leading-[30px] tracking-[0] text-[#181D27] mb-4">{title}</h2>
      {children}
    </section>
  );
}
