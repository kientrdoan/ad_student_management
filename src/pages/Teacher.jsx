/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { Table, Button, Space, Popconfirm, message, Input, Dropdown, Checkbox } from "antd"
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  // UserCheckOutlined,
} from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { deleteTeacherAction, getAllTeacherAction } from "../redux/actions/TeacherAction"
import { Link } from "react-router-dom"
import dayjs from "dayjs"

export default function Teacher() {
  const dispatch = useDispatch()
  const teachers = useSelector((state) => state.TeacherReducer.teachers)
  const [searchText, setSearchText] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    last_name: true,
    first_name: true,
    email: true,
    phone: true,
    created_at: false,
    updated_at: false,
  })

  useEffect(() => {
    dispatch(getAllTeacherAction())
  }, [dispatch])

  const handleDelete = async (id) => {
    const res = await dispatch(deleteTeacherAction(id))
    if (res.success) {
      message.success("Xoá teacher thành công!")
      dispatch(getAllTeacherAction())
    } else {
      message.error("Xoá thất bại!")
    }
  }

  const filteredData = teachers.filter((teacher) => {
    const searchLower = searchText.toLowerCase()
    return (
      teacher.user?.last_name?.toLowerCase().includes(searchLower) ||
      teacher.user?.first_name?.toLowerCase().includes(searchLower) ||
      teacher.user?.email?.toLowerCase().includes(searchLower) ||
      teacher.user?.phone?.toLowerCase().includes(searchLower)
    )
  })

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }))
  }

  const columnMenu = {
    items: [
      {
        key: "id",
        label: (
          <Checkbox checked={visibleColumns.id} onChange={() => toggleColumn("id")}>
            ID
          </Checkbox>
        ),
      },
      {
        key: "last_name",
        label: (
          <Checkbox checked={visibleColumns.last_name} onChange={() => toggleColumn("last_name")}>
            Last Name
          </Checkbox>
        ),
      },
      {
        key: "first_name",
        label: (
          <Checkbox checked={visibleColumns.first_name} onChange={() => toggleColumn("first_name")}>
            First Name
          </Checkbox>
        ),
      },
      {
        key: "email",
        label: (
          <Checkbox checked={visibleColumns.email} onChange={() => toggleColumn("email")}>
            Email
          </Checkbox>
        ),
      },
      {
        key: "phone",
        label: (
          <Checkbox checked={visibleColumns.phone} onChange={() => toggleColumn("phone")}>
            Phone
          </Checkbox>
        ),
      },
      {
        key: "created_at",
        label: (
          <Checkbox checked={visibleColumns.created_at} onChange={() => toggleColumn("created_at")}>
            Created At
          </Checkbox>
        ),
      },
      {
        key: "updated_at",
        label: (
          <Checkbox checked={visibleColumns.updated_at} onChange={() => toggleColumn("updated_at")}>
            Updated At
          </Checkbox>
        ),
      },
    ],
  }

  const allColumns = [
    { title: "ID", dataIndex: "id", key: "id", visible: visibleColumns.id, width: 70 },
    {
      title: "Họ",
      render: (_, r) => r.user?.last_name || "N/A",
      key: "last_name",
      visible: visibleColumns.last_name,
      width: 150,
    },
    {
      title: "Tên",
      render: (_, r) => r.user?.first_name || "N/A",
      key: "first_name",
      visible: visibleColumns.first_name,
      width: 150,
    },
    {
      title: "Email",
      render: (_, r) => r.user?.email || "N/A",
      key: "email",
      visible: visibleColumns.email,
      width: 220,
    },
    {
      title: "Số điện thoại",
      render: (_, r) => r.user?.phone || "N/A",
      key: "phone",
      visible: visibleColumns.phone,
      width: 130,
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
      render: (_, record) => (
        <Space>
          <Link to={`/teachers/detail/${record.id}`}>
            <Button type="link" icon={<EditOutlined />} className="text-indigo-600">
              {/* Edit */}
            </Button>
          </Link>
          <Popconfirm
            title="Bạn có chắc muốn xoá giáo viên này?"
            okText="OK"
            cancelText="Hủy"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              {/* Delete */}
            </Button>
          </Popconfirm>
        </Space>
      ),
      visible: true,
      fixed: "right",
      width: 180,
    },
  ]

  const columns = allColumns.filter((col) => col.visible)

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              {/* <UserCheckOutlined className="text-indigo-600 text-lg" /> */}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Giáo viên</h1>
              <p className="text-sm text-gray-500">Manage teacher information and records</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Link to="/teachers/detail">
            <Button type="primary" icon={<PlusOutlined />} size="large" className="shadow-sm">
              Thêm mới
            </Button>
          </Link>

          <Space size="middle">
            <Input
              placeholder="Search teachers..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size="large"
              allowClear
              className="rounded-lg"
            />
            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button icon={<SettingOutlined />} size="large" className="rounded-lg">
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className="flex-1 overflow-hidden">
          <Table
            bordered
            columns={columns}
            dataSource={filteredData}
            rowKey={(record) => record.id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} teachers`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>
    </div>
  )
}
