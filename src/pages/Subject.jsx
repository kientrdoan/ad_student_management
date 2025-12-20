"use client";

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Dropdown,
  Checkbox,
  Tag,
  Popconfirm,
  message,
  Select,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  BookOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllMajorAction } from "../redux/actions/MajorAction";
import {
  deleteSubjectAction,
  getAllSubjectAction,
} from "../redux/actions/SubjectAction";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { BiRectangle, BiRecycle } from "react-icons/bi";

export default function Subject() {
  const dispatch = useDispatch();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const subjects = useSelector((state) => state.SubjectReducer.subjects);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [visibleColumns, setVisibleColumns] = useState({
    // id: true,
    stt: true,
    code: true,
    name: true,
    credit: true,
    total_period: true,
    major: true,
    is_deleted: true,
    created_at: true,
    updated_at: false,
  });

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllMajorAction("active"));
      await dispatch(getAllSubjectAction(statusFilter));
    };
    loadData();
  }, [dispatch, statusFilter]);

  const filteredData = subjects.filter((subject) => {
    const searchLower = searchText.toLowerCase();
    const major = majors.find((m) => String(m.id) === String(subject.major));
    return (
      subject.code?.toLowerCase().includes(searchLower) ||
      subject.name?.toLowerCase().includes(searchLower) ||
      subject.credit?.toString().includes(searchLower) ||
      major?.name?.toLowerCase().includes(searchLower)
    );
  });

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleStatus = (value) => {
    // const payload = {
    //   is_deleted: value === "active" ? 1 : 0,
    // };
    // if (value === "all") {
    //   dispatch(getAllMajorAction({}));
    //   dispatch(getAllSubjectAction({}));
    // } else if (value === "active") {
    //   dispatch(getAllMajorAction(payload));
    //   dispatch(getAllSubjectAction(payload));
    // } else {
    //   dispatch(getAllMajorAction(payload));
    //   dispatch(getAllSubjectAction(payload));
    // }
    setStatusFilter(value);
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteSubjectAction(id));
    if (res.success) {
      message.success("Thành công!");
      dispatch(getAllSubjectAction(statusFilter));
    } else {
      message.error("Thất bại!");
    }
  };

  const columnMenu = {
    items: [
      // {
      //   key: "id",
      //   label: (
      //     <Checkbox
      //       checked={visibleColumns.id}
      //       onChange={() => toggleColumn("id")}
      //     >
      //       ID
      //     </Checkbox>
      //   ),
      // },
      {
        key: "stt",
        label: (
          <Checkbox
            checked={visibleColumns.stt}
            onChange={() => toggleColumn("stt")}
          >
            STT
          </Checkbox>
        ),
      },
      {
        key: "code",
        label: (
          <Checkbox
            checked={visibleColumns.code}
            onChange={() => toggleColumn("code")}
          >
            Mã môn
          </Checkbox>
        ),
      },
      {
        key: "name",
        label: (
          <Checkbox
            checked={visibleColumns.name}
            onChange={() => toggleColumn("name")}
          >
            Tên môn
          </Checkbox>
        ),
      },
      {
        key: "credit",
        label: (
          <Checkbox
            checked={visibleColumns.credit}
            onChange={() => toggleColumn("credit")}
          >
            Số tín chỉ
          </Checkbox>
        ),
      },
      {
        key: "total_period",
        label: (
          <Checkbox
            checked={visibleColumns.total_period}
            onChange={() => toggleColumn("total_period")}
          >
            Tổng số tiết
          </Checkbox>
        ),
      },
      {
        key: "major",
        label: (
          <Checkbox
            checked={visibleColumns.major}
            onChange={() => toggleColumn("major")}
          >
            Ngành
          </Checkbox>
        ),
      },
      {
        key: "is_deleted",
        label: (
          <Checkbox
            checked={visibleColumns.is_deleted}
            onChange={() => toggleColumn("is_deleted")}
          >
            Trạng thái
          </Checkbox>
        ),
      },
      {
        key: "created_at",
        label: (
          <Checkbox
            checked={visibleColumns.created_at}
            onChange={() => toggleColumn("created_at")}
          >
            Ngày tạo
          </Checkbox>
        ),
      },
      {
        key: "updated_at",
        label: (
          <Checkbox
            checked={visibleColumns.updated_at}
            onChange={() => toggleColumn("updated_at")}
          >
            Cập nhật gần nhất
          </Checkbox>
        ),
      },
    ],
  };

  const allColumns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   width: 70,
    //   visible: visibleColumns.id,
    // },
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      visible: visibleColumns.stt,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã môn",
      dataIndex: "code",
      key: "code",
      visible: visibleColumns.code,
      render: (code) => <Tag color='purple'>{code}</Tag>,
      width: 120,
    },
    {
      title: "Tên môn",
      dataIndex: "name",
      key: "name",
      visible: visibleColumns.name,
      width: 250,
    },
    {
      title: "Tín chỉ",
      dataIndex: "credit",
      key: "credit",
      visible: visibleColumns.credit,
      width: 80,
    },
    {
      title: "Tổng số tiết",
      dataIndex: "total_period",
      key: "total_period",
      visible: visibleColumns.total_period,
      width: 120,
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
      render: (major) => {
        // Kiểm tra nếu department là object có chứa tên
        if (major && major.major_name) {
          return major.major_name;
        }
        return "N/A";
      },
      visible: visibleColumns.major,
      width: 180,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      visible: visibleColumns.is_deleted,
      render: (is_deleted) =>
        is_deleted === undefined ? (
          <Tag color='default'>N/A</Tag>
        ) : is_deleted === false ? (
          <Tag color='green'>Hoạt động</Tag>
        ) : (
          <Tag color='red'>Không hoạt động</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
      width: 150,
    },
    {
      title: "Ngày cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.is_deleted === true ? (
          <Button
            type='link'
            icon={<BiRecycle />}
            onClick={() => handleDelete(record.id)}
            className='text-indigo-600'
          />
        ) : (
          <Space>
            <Link to={`/subjects/detail/${record.id}`}>
              <Button
                type='link'
                icon={<EditOutlined />}
                className='text-indigo-600'
              >
                {/* Edit */}
              </Button>
            </Link>
            <Popconfirm
              title='Bạn có chắc muốn xoá môn học này?'
              okText='OK'
              cancelText='Hủy'
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type='link' danger icon={<DeleteOutlined />}>
                {/* Delete */}
              </Button>
            </Popconfirm>
          </Space>
        ),
      visible: true,
      fixed: "right",
      width: 100,
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className='h-full flex flex-col'>
      <div className='bg-white rounded-xl shadow-sm p-6 flex flex-col h-full'>
        <div className='mb-6 flex-shrink-0'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
              <BookOutlined className='text-indigo-600 text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Môn học</h1>
              <p className='text-sm text-gray-500'>
                Quản lý thông tin môn học
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-6 gap-4 flex-shrink-0'>
          <Link to='/subjects/detail'>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              size='large'
              className='shadow-sm'
            >
              Thêm mới
            </Button>
          </Link>

          <Space size='middle'>
            <Input
              placeholder='Tìm kiếm...'
              prefix={<SearchOutlined className='text-gray-400' />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size='large'
              allowClear
              className='rounded-lg'
            />

            <Select
              value={statusFilter}
              onChange={handleStatus}
              style={{ width: 180 }}
              size='large'
              options={[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Không hoạt động" },
              ]}
            />

            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button
                icon={<SettingOutlined />}
                size='large'
                className='rounded-lg'
              >
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className='flex-1 overflow-hidden'>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(r) => r.id}
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} subjects`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>
    </div>
  );
}
