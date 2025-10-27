"use client"

import { useEffect, useState } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  DatePicker,
  Select,
  Popconfirm,
  Dropdown,
  Checkbox,
  Tag,
} from "antd"
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import dayjs from "dayjs"
import {
  addSemesterAction,
  deleteSemesterAction,
  editSemesterAction,
  getAllSemesterAction,
} from "../redux/actions/SemesterAction"

export default function Semester() {
  const dispatch = useDispatch()
  const semesters = useSelector((state) => state.SemesterReducer.semesters)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    year: true,
    semesters: true,
    start_date: true,
    end_date: true,
    created_at: true,
    updated_at: true,
  })

  useEffect(() => {
    dispatch(getAllSemesterAction())
  }, [dispatch])

  const showAddModal = () => {
    setEditingRecord(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const showEditModal = (record) => {
    setEditingRecord(record)
    form.setFieldsValue({
      ...record,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
    })
    setIsModalVisible(true)
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      const formattedValues = {
        ...values,
        start_date: values.start_date ? values.start_date.format("YYYY-MM-DD") : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
      }

      if (editingRecord) {
        const newValues = { ...editingRecord, ...formattedValues }
        const res = await dispatch(editSemesterAction(editingRecord.id, newValues))
        if (res.success) {
          message.success("Edit semester successfully!")
          dispatch(getAllSemesterAction())
        } else {
          message.error("Failed to edit semester!")
        }
      } else {
        const res = await dispatch(addSemesterAction(formattedValues))
        if (res.success) {
          message.success("Add semester successfully!")
          dispatch(getAllSemesterAction())
        } else {
          message.error("Failed to add semester!")
        }
      }
      setIsModalVisible(false)
    } catch (err) {
      console.log("Validate Failed:", err)
    }
  }

  const handleDelete = async (id) => {
    const res = await dispatch(deleteSemesterAction(id))
    if (res.success) {
      message.success("Xoá semester thành công!")
      dispatch(getAllSemesterAction())
    } else {
      message.error("Xoá thất bại!")
    }
  }

  const filteredData = semesters.filter((semester) => {
    const searchLower = searchText.toLowerCase()
    return (
      semester.year?.toString().includes(searchLower) ||
      semester.semesters?.toLowerCase().includes(searchLower) ||
      semester.start_date?.includes(searchLower) ||
      semester.end_date?.includes(searchLower)
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
        key: "year",
        label: (
          <Checkbox checked={visibleColumns.year} onChange={() => toggleColumn("year")}>
            Year
          </Checkbox>
        ),
      },
      {
        key: "semesters",
        label: (
          <Checkbox checked={visibleColumns.semesters} onChange={() => toggleColumn("semesters")}>
            Semester
          </Checkbox>
        ),
      },
      {
        key: "start_date",
        label: (
          <Checkbox checked={visibleColumns.start_date} onChange={() => toggleColumn("start_date")}>
            Start Date
          </Checkbox>
        ),
      },
      {
        key: "end_date",
        label: (
          <Checkbox checked={visibleColumns.end_date} onChange={() => toggleColumn("end_date")}>
            End Date
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
    { title: "Năm học", dataIndex: "year", key: "year", visible: visibleColumns.year },
    {
      title: "Học kỳ",
      dataIndex: "semesters",
      key: "semesters",
      visible: visibleColumns.semesters,
      render: (sem) => <Tag color="geekblue">{sem}</Tag>,
    },
    { title: "Ngày bắt đầu", dataIndex: "start_date", key: "start_date", visible: visibleColumns.start_date },
    { title: "Ngày kết thúc", dataIndex: "end_date", key: "end_date", visible: visibleColumns.end_date },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEditModal(record)} className="text-indigo-600">
            {/* Edit */}
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xoá học kỳ này?"
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
              <CalendarOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Semesters</h1>
              <p className="text-sm text-gray-500">Manage academic semester periods</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal} size="large" className="shadow-sm">
            Thêm mới
          </Button>

          <Space size="middle">
            <Input
              placeholder="Search semesters..."
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
              showTotal: (total) => `Total ${total} semesters`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Edit Semester" : "Add Semester"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Năm học" name="year" rules={[{ required: true, message: "Vui lòng nhập năm học!" }]}>
            <Input min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Học kỳ" name="semesters" rules={[{ required: true, message: "Vui lòng chọn học kỳ!" }]}>
            <Select placeholder="Select semester">
              <Select.Option value="Học kỳ 1">Học kỳ 1</Select.Option>
              <Select.Option value="Học kỳ 2">Học kỳ 2</Select.Option>
              <Select.Option value="Học kỳ 3">Học kỳ 3</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Ngày kết thúc" name="end_date" rules={[{ required: true, message: "Vui lòng nhập ngày kết thúc!" }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
