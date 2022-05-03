import React from "react";
import confetti from "./confetti.js";

export default class Confetti extends React.Component {
  constructor(props) {
    super(props);
    this.colors = window.localStorage.getItem("confetti");
    this.state = {
      colors: this.colors
        ? JSON.parse(this.colors)
        : ["red", "orange", "yellow", "green", "blue"],
      modal: props.open
    };

    this.updateColors = this.updateColors.bind(this);
    confetti.colorList = this.state.colors;
    confetti.start();
  }

  updateColors(e) {
    this.setState(x => {
      const z = x.colors.concat();
      z.includes(e.target.value)
        ? z.splice(z.indexOf(e.target.value), 1)
        : z.push(e.target.value);
      confetti.remove();
      if (z.length == 0) {
        confetti.colorList = ["transparent"];
      } else {
        confetti.colorList = z;
      }
      confetti.start();
      window.localStorage.setItem("confetti", JSON.stringify(z));
      return { colors: z };
    });
  }

  render() {
    return (
      <>
        {this.state.modal && (
          <div className="modal">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => this.setState(() => ({ modal: !1 }))}
            >
              X
            </span>
            <h1>Confetti Colors</h1>
            <hr />
            <label>
              Red
              <input
                type="checkbox"
                value="red"
                checked={this.state.colors.includes("red")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Orange
              <input
                type="checkbox"
                value="orange"
                checked={this.state.colors.includes("orange")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Yellow
              <input
                type="checkbox"
                value="yellow"
                checked={this.state.colors.includes("yellow")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Green
              <input
                type="checkbox"
                value="green"
                checked={this.state.colors.includes("green")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Lime
              <input
                type="checkbox"
                value="lime"
                checked={this.state.colors.includes("lime")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Dark Green
              <input
                type="checkbox"
                value="darkGreen"
                checked={this.state.colors.includes("darkGreen")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Blue
              <input
                type="checkbox"
                value="blue"
                checked={this.state.colors.includes("blue")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Cyan
              <input
                type="checkbox"
                value="cyan"
                checked={this.state.colors.includes("cyan")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Dark Cyan
              <input
                type="checkbox"
                value="darkCyan"
                checked={this.state.colors.includes("darkCyan")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Purple
              <input
                type="checkbox"
                value="purple"
                checked={this.state.colors.includes("purple")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Magenta
              <input
                type="checkbox"
                value="magenta"
                checked={this.state.colors.includes("magenta")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Pink
              <input
                type="checkbox"
                value="pink"
                checked={this.state.colors.includes("pink")}
                onChange={this.updateColors}
              />
            </label>
            <label>
              Black
              <input
                type="checkbox"
                value="black"
                checked={this.state.colors.includes("black")}
                onChange={this.updateColors}
              />
            </label>
          </div>
        )}
      </>
    );
  }
}
