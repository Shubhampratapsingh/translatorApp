import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useAuth } from "@clerk/clerk-react";
import { openNotification } from "../../utils/notification";
import { deleteTranscript, fetchTranscript } from "../../services";
import { formatDate } from "../../utils/dateFormat";
import { DeleteOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const token = await getToken();
      const res = await fetchTranscript(token);
      if (res) {
        setData(res?.documents);
      }
    } catch (error) {
      openNotification(
        "error",
        "Error occurred while fetching transcripts.",
        ""
      );
    }
  }

  const columns = [
    {
      title: "User 1 Transcript",
      dataIndex: "user1_transcript",
    },
    {
      title: "User 2 Transcript",
      dataIndex: "user2_transcript",
    },
    {
      title: "Summary",
      dataIndex: "summary",
    },
    {
      title: "Date",
      dataIndex: "$createdAt",
      render: (createdAt) => formatDate(createdAt),
      sorter: (a, b) => new Date(a?.createdAt) - new Date(b?.createdAt),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "",
      key: "x",
      render: (_, record) => (
        <DeleteOutlined
          onClick={() => handleDelete(record)}
          style={{ color: "red", cursor: "pointer" }}
        />
      ),
    },
  ];

  const handleDelete = async (record) => {
    try {
      const token = await getToken();
      const res = await deleteTranscript(record?.$id, token);
      if (res) {
        openNotification("success", "Deleted succesfully.");
        fetchData();
      }
    } catch (error) {
      openNotification("error", "Error deleting transcript", "");
    }
  };
  return (
    <div className="p-6">
      <Table columns={columns} dataSource={data} className="transcript-table" />
    </div>
  );
};

export default Dashboard;
