import React from "react";

//this file is very erroneous, long, and repetitive
//but it works 

export default class ScheduleInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      schedule: props.schedule || [],
      unsaved: false,
      errors: [],
      dragging: false,
      mobile: window.innerWidth <= 1000,
      index: 0
    };

    this.saveSchedule = this.saveSchedule.bind(this);
  }

  componentDidMount(){
    window.addEventListener("resize", () => {
      this.setState(s=>({mobile: window.innerWidth <= 1000}));
    })
  }

  dTime(t){
    let [h,m]=t.split(":");

    let d = new Date();
    d.setHours(h);
    d.setMinutes(m);
    d.setSeconds(0);
    return d;
  }

  saveSchedule(t){
    console.log("wow");
    //check for invalid class periods
    let errors = t.map((x,i, a)=>{
      console.log(x);
      if(!x.name || !x.time.length || !x.time[0] || !x.time[1]){
        console.log("blank");
        return "Please fill in all fields";
      } else if(this.dTime(x.time[0]) > this.dTime(x.time[1])){
        return "Invalid times. Start time must be before end time";
      } else if(i > 0 && a[i-1].time[1] && this.dTime(x.time[0]) < this.dTime(a[i-1].time[1]) ) {
        return "Invalid times. Start time must be after previous end time";
      } else {
        return "";
      }
    });

    this.setState({errors, unsaved: errors.filter(x=>!!x).length > 0});

    if(errors.filter(x=>x!=="").length == 0){
      this.props.setSchedule(t);
    }
  }

  renderPeriodTable() {
    return this.state.schedule.map((x, i) => (
      this.state.mobile? <React.Fragment>
        <p>Period Name</p>  <input
            onChange={(e) =>
              this.setState((s) => {
                var t = s.schedule.concat();
                t[i].name = e.target.value;
                return { schedule: t, unsaved: true };
              })
            }
            type="text"
            placeholder="1st Period"
            value={x.name||""}
          />

          <p>Start Time</p>
          <input
            type="time"
            onChange={(e) =>
              this.setState((s) => {
                var t = s.schedule.concat();
                t[i].time[0] = e.target.value;
                return { schedule: t, unsaved: true };
              })
            }
            value={x.time[0]||""}
          />
          <p>End Time</p>
          <input
            type="time"
            onChange={(e) =>
              this.setState((s) => {
                var t = s.schedule.concat();
                t[i].time[1] = e.target.value;
                return { schedule: t, unsaved: true };
              })
            }
            value={x.time[1]||""}
          />
          <span className="error">{this.state.errors[i]}</span>
        </React.Fragment>: 
        <React.Fragment key={i}>
        <tr>
        <td>
        <input
            onChange={(e) =>
              this.setState((s) => {
                var t = s.schedule.concat();
                t[i].name = e.target.value;
                return { schedule: t, unsaved: true };
              })
            }
            type="text"
            placeholder="1st Period"
            value={x.name||""}
          />
        </td>
        <td>
          <input
            type="time"
            onChange={(e) =>
              this.setState((s) => {
                var t = s.schedule.concat();
                t[i].time[0] = e.target.value;
                return { schedule: t, unsaved: true };
              })
            }
            value={x.time[0]||""}
          />
        </td>
        <td>
          <input
            type="time"
            onChange={(e) =>
              this.setState((s) => {
                var t = s.schedule.concat();
                t[i].time[1] = e.target.value;
                return { schedule: t, unsaved: true };
            })
        }
        value={x.time[1]||""}
        />
        </td>
        <td>
          <button
            className="inline"
            onClick={() =>
              this.setState((s) => {
                var t = s.schedule.concat();
                t.splice(i, 1);
                return { schedule: t, unsaved: true };
              })
            }
            title="Remove Class Period"
            >
            <i className="fa fa-x"></i>
          </button>
        </td>
      </tr><tr>
        <td colSpan="3">
          {this.state.errors[i] && <p className="error">{this.state.errors[i]}</p>}
        </td>

      </tr></React.Fragment>
    ));
  }

  render() {
    return (
     <>{this.state.schedule.length > 0 ? (this.state.mobile ? 
      <div className="table-mobile">
        {this.renderPeriodTable()[this.state.index]}
        <p className="text-center">{this.state.index+1} out of {this.state.schedule.length}</p>
        <div>
        <button title="delete this period" disabled={this.state.schedule.length==0} onClick={()=>this.setState((s) => {
          if(!confirm("Delete this class period?")) {return}
                var t = s.schedule.concat();
                t.splice(s.index, 1);
                return { schedule: t, index: 0, unsaved: true };
              })}>
          <i className="fa fa-x"></i>
        </button>
        <button disabled={this.state.index==0} onClick={()=>this.setState(s=>({index:Math.max(s.index-1, 0)}))}>
          <i className="fa fa-arrow-left"></i>
        </button>
        <button disabled={this.state.index==this.state.schedule.length-1} onClick={()=>this.setState(s=>({index:Math.min(s.index+1, s.schedule.length-1)}))}>
          <i className="fa fa-arrow-right"></i>
        </button>
        </div>
      </div>
      :
            <table>
              <thead></thead>
              <tbody>
                <tr>
                  <th>Period Name</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th></th>
                </tr>
                {this.renderPeriodTable()}
              </tbody>
            </table>
        ) :<p>
            Nothing here yet. Click the <i className="fa fa-plus-circle"></i> icon to add a class period.</p>}
    
        <button
        title="New Class Period"
          onClick={() =>
            this.setState((s) => {
              var e = s.schedule.concat();
              e.push({ name: "", time: [], index: s++ });
              
              return { schedule: e, unsaved:true };
            })
          }
        >
            <i className="fa fa-plus-circle"></i>
        </button>
        <button
        title="Reset Schedule"
              onClick={() => {
                if(!confirm("Delete your entire schedule?")){return;}
                  this.setState({schedule:[], unsaved:true});
              }}
              disabled={this.state.schedule.length == 0}
            >
              <i className="fa fa-trash"></i>
            </button>
            <button
            title="Save Schedule" 
            disabled={!this.state.unsaved}
              onClick={() => {
                this.saveSchedule(this.state.schedule);
              }}>
                <i className="fa fa-save"></i>
            </button>
      </>
    );
  }
}
