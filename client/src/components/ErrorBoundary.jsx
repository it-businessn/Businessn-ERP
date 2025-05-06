import { Component } from "react";
import { Navigate } from "react-router-dom";

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true });
	}

	render() {
		return this.state.hasError ? <Navigate to="/login" /> : this.props.children;
	}
}

export default ErrorBoundary;
