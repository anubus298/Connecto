import { Skeleton } from "antd";

function Main_skeleton() {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <Skeleton>
          <h1>HOHOHOHOH</h1>
        </Skeleton>
      </div>
      <Skeleton>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Similique
          eos perspiciatis provident ratione, modi quas ad nostrum eaque? Porro
          alias itaque incidunt possimus iure beatae reprehenderit obcaecati
          modi neque corrupti!
        </p>
      </Skeleton>
    </div>
  );
}

export default Main_skeleton;
