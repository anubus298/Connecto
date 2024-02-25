import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "antd";

function Main_settings_account() {
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <h6 className="mb-1 h3">Account</h6>
        <hr></hr>
      </div>
      <div className="col-span-12 px-2 p-1 mt-3 border-[1px] rounded-md">
        <div className="flex items-center justify-between">
          <h6 className="text-lg font-semibold">Password</h6>
          <Button disabled type="text" className="flex items-center gap-2">
            Change password
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
      </div>
      <div className="col-span-12 px-2 p-1 mt-3 border-[1px] rounded-md">
        <div className="flex items-center justify-between">
          <h6 className="text-lg font-semibold">Email</h6>
          <Button disabled type="text" className="flex items-center gap-2">
            Change Email
            <FontAwesomeIcon icon={faArrowRight} />
          </Button>
        </div>
      </div>
      <div className="col-span-12 p-1 px-2 mt-3">
        <div className="flex justify-end">
          <Button
            disabled
            type="primary"
            danger
            className="flex items-center gap-2"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Main_settings_account;
