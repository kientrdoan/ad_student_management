"use client"

import { useEffect, useState } from "react"
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Dropdown, Checkbox, Tag } from "antd"
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ApartmentOutlined,
} from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { deleteDepartmentAction, editDepartmentAction, getAllAction } from "../redux/actions/DepartmentsAction"
import { addDepartmentAction } from "../redux/actions/DepartmentsAction"
import dayjs from "dayjs"

export default function Department() {
  const dispatch = useDispatch()
  const departments = useSelector((state) => state.DepartmentReducer.departments)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    code: true,
    name: true,
    created_at: true,
    updated_at: true,
  })

  useEffect(() => {
    dispatch(getAllAction())
  }, [dispatch])

  const showAddModal = () => {
    setEditingRecord(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const showEditModal = (record) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingRecord) {
        const newValues = { ...editingRecord, ...values }
        console.log("Edit department:", newValues)
        const res = await dispatch(editDepartmentAction(editingRecord.id, newValues))
        console.log("res edit", res)
        if (res.success) {
          message.success("Edit department successfully!")
          dispatch(getAllAction())
        } else {
          message.error("Failed to edit department!")
        }
      } else {
        const res = await dispatch(addDepartmentAction(values))
        if (res.success) {
          message.success("Add department successfully!")
          dispatch(getAllAction())
        } else {
          message.error("Failed to add department!")
        }
      }
      setIsModalVisible(false)
    } catch (err) {
      console.log("Validate Failed:", err)
    }
  }

  const handleDelete = async (id) => {
    const res = await dispatch(deleteDepartmentAction(id))
    if (res.success) {
      message.success("Xoá khoa thành công!")
      dispatch(getAllAction())
    } else {
      message.error("Xoá thất bại!")
    }
  }

  const filteredData = departments.filter((dept) => {
    const searchLower = searchText.toLowerCase()
    return dept.code?.toLowerCase().includes(searchLower) || dept.name?.toLowerCase().includes(searchLower)
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
        key: "code",
        label: (
          <Checkbox checked={visibleColumns.code} onChange={() => toggleColumn("code")}>
            Code
          </Checkbox>
        ),
      },
      {
        key: "name",
        label: (
          <Checkbox checked={visibleColumns.name} onChange={() => toggleColumn("name")}>
            Name
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
    { title: "ID", dataIndex: "id", key: "id", visible: visibleColumns.id, width: 80 },
    {
      title: "Mã khoa",
      dataIndex: "code",
      key: "code",
      visible: visibleColumns.code,
      render: (code) => <Tag color="green">{code}</Tag>,
    },
    { title: "Tên Khoa", dataIndex: "name", key: "name", visible: visibleColumns.name },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
    },
    {
      title: "Thời gian cập nhật",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEditModal(record)} className="text-indigo-600">
            {/* Edit */}
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xoá department này?"
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
      width: 150,
    },
  ]

  const columns = allColumns.filter((col) => col.visible)

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ApartmentOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-sm text-gray-500">Manage department information and structure</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large" className="shadow-sm">
            Thêm mới
          </Button>

          <Space size="middle">
            <Input
              placeholder="Search departments..."
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
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} departments`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Edit Department" : "Add Department"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Mã khoa" name="code" rules={[{ required: true, message: "Please input code!" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Tên khoa" name="name" rules={[{ required: true, message: "Please input name!" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
