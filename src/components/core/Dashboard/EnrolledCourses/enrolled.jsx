import Tabs from "../../../common/ui/Tabs";

function Enroll(){

    const Tab = [
        {
      id: "all",
      label: "All",
    },
     {
      id: "pending",
      label: "Pending",
    },
     {
      id: "completed",
      label: "Completed",
    }
    ]
    return(
        <div className="p-2 text-white">
        <div className=" text-pure-greys-400 font-Poppins">
        <a>Home </a> /
        <a> Display </a> /
        <a className="text-xl text-yellow-25"> Enrolled Courses</a>
        </div>
        <div>
        <h1 className="pt-4 text-3xl">Enrolled Courses</h1>
        </div>

        {//tabs
            }
            <Tabs tabs={Tab} defaultActiveId="all"/>
            
        </div>
    )
}

export default Enroll;