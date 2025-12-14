"use client";

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Input,
  Dropdown,
  Checkbox,
  Tag,
  Select,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudentAction,
  deleteStudentAction,
} from "../redux/actions/StudentAction";
import { getAllClassAction } from "../redux/actions/ClassAction";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { BiRecycle } from "react-icons/bi";

export default function Student() {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.StudentReducer.students);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    student_code: true,
    last_name: true,
    first_name: true,
    class_student: true,
    email: true,
    phone: true,
    is_deleted: true,
    created_at: false,
    updated_at: false,
  });

  const classes = useSelector((state) => state.ClassReducer.classes);
  const [selectedClassId, setSelectedClassId] = useState(undefined);

  useEffect(() => {
    dispatch(getAllStudentAction(statusFilter, selectedClassId));
  }, [dispatch, statusFilter, selectedClassId]);

  useEffect(() => {
    dispatch(getAllClassAction("active"));
  }, []);

  const handleDelete = async (id) => {
    const res = await dispatch(deleteStudentAction(id));
    if (res.success) {
      message.success("Thành công!");
      dispatch(getAllStudentAction(statusFilter, selectedClassId));
    } else {
      message.error("Thất bại!");
    }
  };

  const filteredData = students.filter((student) => {
    const searchLower = searchText.toLowerCase();
    return (
      student.student_code?.toLowerCase().includes(searchLower) ||
      student.user?.last_name?.toLowerCase().includes(searchLower) ||
      student.user?.first_name?.toLowerCase().includes(searchLower) ||
      student.class_student?.toLowerCase().includes(searchLower) ||
      student.user?.email?.toLowerCase().includes(searchLower) ||
      student.user?.phone?.toLowerCase().includes(searchLower)
    );
  });

  const handleStatus = (value) => {
    setStatusFilter(value);
    // if (value === "all") {
    //   dispatch(getAllStudentAction({}, selectedClassId));
    // } else if (value === "active") {
    //   dispatch(getAllStudentAction(statusFilter, selectedClassId));
    // } else {
    //   dispatch(getAllStudentAction(statusFilter, selectedClassId));
    // }
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const columnMenu = {
    items: [
      {
        key: "id",
        label: (
          <Checkbox
            checked={visibleColumns.id}
            onChange={() => toggleColumn("id")}
          >
            ID
          </Checkbox>
        ),
      },
      {
        key: "student_code",
        label: (
          <Checkbox
            checked={visibleColumns.student_code}
            onChange={() => toggleColumn("student_code")}
          >
            Student Code
          </Checkbox>
        ),
      },
      {
        key: "last_name",
        label: (
          <Checkbox
            checked={visibleColumns.last_name}
            onChange={() => toggleColumn("last_name")}
          >
            Last Name
          </Checkbox>
        ),
      },
      {
        key: "first_name",
        label: (
          <Checkbox
            checked={visibleColumns.first_name}
            onChange={() => toggleColumn("first_name")}
          >
            First Name
          </Checkbox>
        ),
      },
      {
        key: "class_student",
        label: (
          <Checkbox
            checked={visibleColumns.class_student}
            onChange={() => toggleColumn("class_student")}
          >
            Class
          </Checkbox>
        ),
      },
      {
        key: "email",
        label: (
          <Checkbox
            checked={visibleColumns.email}
            onChange={() => toggleColumn("email")}
          >
            Email
          </Checkbox>
        ),
      },
      {
        key: "phone",
        label: (
          <Checkbox
            checked={visibleColumns.phone}
            onChange={() => toggleColumn("phone")}
          >
            Phone
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
            Created At
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
            Updated At
          </Checkbox>
        ),
      },
    ],
  };

  const allColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      visible: visibleColumns.id,
      width: 70,
    },
    {
      title: "Mã sinh viên",
      dataIndex: "student_code",
      key: "student_code",
      visible: visibleColumns.student_code,
      width: 130,
    },
    {
      title: "Họ",
      render: (_, r) => r.user?.last_name || "N/A",
      key: "last_name",
      visible: visibleColumns.last_name,
      width: 120,
    },
    {
      title: "Tên",
      render: (_, r) => r.user?.first_name || "N/A",
      key: "first_name",
      visible: visibleColumns.first_name,
      width: 120,
    },
    {
      title: "Lớp sinh viên",
      dataIndex: "class_student",
      key: "class_student",
      visible: visibleColumns.class_student,
      render: (class_student) =>
        class_student ? <Tag color='blue'>{class_student.name}</Tag> : "N/A",
      width: 100,
    },
    {
      title: "Email",
      render: (_, r) => r.user?.email || "N/A",
      key: "email",
      visible: visibleColumns.email,
      width: 200,
    },
    {
      title: "Số điện thoại",
      render: (_, r) => r.user?.phone || "N/A",
      key: "phone",
      visible: visibleColumns.phone,
      width: 120,
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
      visible: visibleColumns.created_at,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      width: 150,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      visible: visibleColumns.updated_at,
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      width: 150,
    },
    {
      title: "Action",
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
            <Link to={`/students/detail/${record.id}`}>
              <Button
                type='link'
                icon={<EditOutlined />}
                className='text-indigo-600'
              >
                {/* Edit */}
              </Button>
            </Link>
            <Popconfirm
              title='Bạn có chắc muốn xoá sinh viên này?'
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
      width: 180,
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className='h-full flex flex-col'>
      <div className='bg-white rounded-lg border border-[#d4d1c6] p-8 flex flex-col h-full'>
        <div className='mb-8 flex-shrink-0'>
          <div className='flex items-center gap-4 mb-2'>
            <div className='w-12 h-12 rounded-md bg-[#f5f3ed] flex items-center justify-center border border-[#d4d1c6]'>
              <UserOutlined className='text-[#2c3e50] text-xl' />
            </div>
            <div>
              <h1 className='text-3xl font-serif font-semibold text-gray-900'>
                Students
              </h1>
              <p className='text-sm text-gray-600 mt-1'>
                Manage student information and records
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-8 gap-4 flex-shrink-0'>
          <Link to='/students/detail'>
            <Button type='primary' icon={<PlusOutlined />} size='large'>
              Thêm mới
            </Button>
          </Link>

          <Select
            style={{ width: 250 }}
            placeholder='Chọn lớp'
            size='large'
            loading={!classes}
            allowClear={true}
            onChange={(value) => setSelectedClassId(value)}
          >
            {classes?.map((c) => (
              <Select.Option key={c.id} value={c.id}>
                {c.name}
              </Select.Option>
            ))}
          </Select>

          <Space size='middle'>
            <Input
              placeholder='Search students...'
              prefix={<SearchOutlined className='text-gray-400' />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size='large'
              allowClear
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
              <Button icon={<SettingOutlined />} size='large'>
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className='flex-1 overflow-hidden'>
          <Table
            bordered
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} students`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>
    </div>
  );
}
