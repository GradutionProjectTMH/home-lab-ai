import { AnyAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import React, { HtmlHTMLAttributes } from "react";
import { connect, DispatchProp } from "react-redux";
import { popMessage, pushError } from "../../redux/slices/message.slice";

class ErrorBoundary extends React.Component<HtmlHTMLAttributes<HTMLDivElement> & DispatchProp<AnyAction>> {
	handlePromiseRejection = ({ reason }: any) => {
		this.props.dispatch(popMessage({ isClearAll: true }));

		if (reason instanceof AxiosError) {
			const { error, statusCode, message } = reason.response?.data || {};

			switch (statusCode) {
				case 400:
					if (message instanceof Array)
						message.forEach((message) => this.props.dispatch(pushError(`${error}: ${message}`)));
					else this.props.dispatch(pushError(`${error}: ${message}`));
					break;

				default:
					this.props.dispatch(pushError("Lỗi không xác định"));
			}

			return;
		}

		this.props.dispatch(pushError(reason?.message || reason));
	};

	getDerivedStateFromError(error: Error) {
		this.props.dispatch(pushError(error?.message));
	}

	componentDidMount() {
		window.addEventListener("unhandledrejection", this.handlePromiseRejection);
	}

	componentWillUnmount() {
		window.removeEventListener("unhandledrejection", this.handlePromiseRejection);
	}

	componentDidCatch(error: Error) {
		this.props.dispatch(pushError(error?.message));
	}

	render() {
		return this.props.children;
	}
}

export default connect()(ErrorBoundary);
