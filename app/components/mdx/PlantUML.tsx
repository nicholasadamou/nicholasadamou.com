import React from "react";
import Image from "next/image";

interface PlantUMLProps {
	code: string;
}

const PlantUML: React.FC<PlantUMLProps> = ({ code }) => {
	return (
		<Image
			src={`https://www.plantuml.com/plantuml/svg/${encodeURIComponent(code)}`}
			alt="PlantUML Diagram"
			style={{ maxWidth: "100%", height: "auto" }}
		/>
	);
};

export default PlantUML;
