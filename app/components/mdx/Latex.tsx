import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const Latex = ({ children, block }: { children: string; block?: boolean }) => {
	return block ? <BlockMath>{children}</BlockMath> : <InlineMath>{children}</InlineMath>;
};

export default Latex;
