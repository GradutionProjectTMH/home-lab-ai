import { AnyAction } from "@reduxjs/toolkit";
import React, { HtmlHTMLAttributes } from "react";
import { connect, DispatchProp } from "react-redux";
import { pushError } from "../../redux/slices/message.slice";

class ErrorBoundary extends React.Component<HtmlHTMLAttributes<HTMLDivElement> & DispatchProp<AnyAction>> {
	handlePromiseRejection = ({ reason }: any) => {
		this.props.dispatch(pushError(reason.message));
	};

	componentDidMount() {
		window.addEventListener("unhandledrejection", this.handlePromiseRejection);
	}

	componentWillUnmount() {
		window.removeEventListener("unhandledrejection", this.handlePromiseRejection);
	}

	componentDidCatch(error: Error) {
		this.props.dispatch(pushError(error.message));
	}

	render() {
		console.log(123123123123123);
		return this.props.children;
	}
}

export default connect()(ErrorBoundary);
