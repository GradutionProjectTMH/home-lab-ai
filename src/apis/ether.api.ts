const isConnected = () => (window as any).ethereum.isConnected();

const Ether = {
	isConnected,
};

export default Ether;
