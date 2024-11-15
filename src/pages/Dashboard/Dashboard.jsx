import React, { useState, useEffect } from "react";
import { Table, Input, Button, Spin, Tooltip } from "antd";
import { useAuth } from "@clerk/clerk-react";
import { openNotification } from "../../utils/notification";
import { deleteTranscript, fetchTranscript } from "../../services";
import { formatDate } from "../../utils/dateFormat";
import {
  DeleteOutlined,
  RobotOutlined,
  MinusCircleTwoTone,
} from "@ant-design/icons";
import { AskAI } from "../../utils/askAI";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

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
      title: "First User Transcript",
      dataIndex: "user1_transcript",
    },
    {
      title: "Second User Transcript",
      dataIndex: "user2_transcript",
    },
    {
      title: "Summary of Conversation",
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
        openNotification("success", "Deleted successfully.");
        fetchData();
      }
    } catch (error) {
      openNotification("error", "Error deleting transcript", "");
    }
  };

  const handleAskAI = async (prompt, record) => {
    if (prompt) {
      const finalTranscript =
        "User one transcript is " +
        record?.user1_transcript +
        " and User two transcript is " +
        record?.user2_transcript;
      const finalPrompt = prompt + " in this session";
      try {
        setLoading(true);
        const response = await AskAI(finalTranscript, finalPrompt);
        setExpandedRows((prev) => ({
          ...prev,
          [record.$id]: { ...prev[record.$id], aiReply: response },
        }));
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    } else {
      openNotification("error", "Enter prompt to ask AI", "");
    }
  };

  const expandedRowRender = (record) => {
    const rowState = expandedRows[record.$id] || {};
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Input.TextArea
            rows={3}
            value={rowState.question || ""}
            onChange={(e) =>
              setExpandedRows((prev) => ({
                ...prev,
                [record.$id]: { ...prev[record.$id], question: e.target.value },
              }))
            }
            placeholder="Enter your question for AI"
          />
          <Button
            type="primary"
            disabled={loading}
            className="w-1/4"
            onClick={() => handleAskAI(rowState.question, record)}
          >
            Ask AI
          </Button>
        </div>
        <div className="text-center py-4">
          {loading ? (
            <Spin />
          ) : (
            <p className="text-start">{rowState.aiReply}</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="p-6">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.$id}
        expandable={{
          expandedRowRender,
          rowExpandable: (record) => record?.$id,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ) : (
              <Tooltip title="Ask AI">
                <RobotOutlined
                  onClick={(e) => onExpand(record, e)}
                  style={{ fontSize: "20px" }}
                />
              </Tooltip>
            ),
        }}
      />
    </div>
  );
};

export default Dashboard;
