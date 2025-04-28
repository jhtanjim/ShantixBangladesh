

// 🛠️ 1. Define the type at the top
type SectionTitleProps = {
  heading: string;
  subheading: string;
};

// 🎯 2. Then create the component using that type
const SectionTitle: React.FC<SectionTitleProps> = ({ heading, subheading }) => {
  return (
    <div className="text-center my-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold uppercase text-dark-blue">{heading}</h1>
        <h2 className="italic text- text-2xl md:text-2xl mt-1 uppercase">{subheading}</h2>
      </div>
    </div>
  );
};

export default SectionTitle;
